from __future__ import annotations

import math
import sys
from dataclasses import dataclass
from pathlib import Path

import bmesh
import bpy
from mathutils import Vector


GEN_COLLECTION_NAME = "Generated_Bag_Exports"
FABRIC_TILE_DENSITY = 22.0
DEFAULT_FABRIC_DIR = Path("D:/AWS/NAP/3d model/Fabric062_2k-JPG")


@dataclass(frozen=True)
class BagStyle:
    gusset_inset_ratio: float
    front_sag_ratio: float
    side_sag_ratio: float
    handle_spacing_ratio: float
    handle_width_ratio: float
    handle_rise_ratio: float
    handle_attach_ratio: float
    handle_inward_ratio: float
    piping_width_ratio: float
    seam_band_ratio: float
    print_uv_overscan: float


@dataclass(frozen=True)
class BagSpec:
    category: str
    size: str
    width: float
    depth: float
    height: float

    @property
    def filename(self) -> str:
        width_mm = int(round(self.width * 1000))
        depth_mm = int(round(self.depth * 1000))
        height_mm = int(round(self.height * 1000))
        return f"{self.category}_{width_mm}x{depth_mm}x{height_mm}mm.glb"

    @property
    def object_name(self) -> str:
        return Path(self.filename).stem


BAG_STYLES = {
    "pizza": BagStyle(
        gusset_inset_ratio=0.15,
        front_sag_ratio=0.05,
        side_sag_ratio=0.03,
        handle_spacing_ratio=0.28,
        handle_width_ratio=0.085,
        handle_rise_ratio=0.26,
        handle_attach_ratio=0.82,
        handle_inward_ratio=0.04,
        piping_width_ratio=0.026,
        seam_band_ratio=0.055,
        print_uv_overscan=0.045,
    ),
    "takeaway": BagStyle(
        gusset_inset_ratio=0.12,
        front_sag_ratio=0.03,
        side_sag_ratio=0.022,
        handle_spacing_ratio=0.26,
        handle_width_ratio=0.075,
        handle_rise_ratio=0.36,
        handle_attach_ratio=0.84,
        handle_inward_ratio=0.025,
        piping_width_ratio=0.022,
        seam_band_ratio=0.05,
        print_uv_overscan=0.04,
    ),
    "retail": BagStyle(
        gusset_inset_ratio=0.11,
        front_sag_ratio=0.025,
        side_sag_ratio=0.02,
        handle_spacing_ratio=0.27,
        handle_width_ratio=0.07,
        handle_rise_ratio=0.4,
        handle_attach_ratio=0.845,
        handle_inward_ratio=0.02,
        piping_width_ratio=0.02,
        seam_band_ratio=0.045,
        print_uv_overscan=0.038,
    ),
}


BAG_SPECS = [
    BagSpec("pizza", "small", 0.24, 0.24, 0.15),
    BagSpec("pizza", "medium", 0.36, 0.33, 0.26),
    BagSpec("pizza", "large", 0.50, 0.50, 0.20),
    BagSpec("takeaway", "small", 0.25, 0.18, 0.25),
    BagSpec("takeaway", "medium", 0.35, 0.17, 0.245),
    BagSpec("takeaway", "large", 0.36, 0.33, 0.26),
    BagSpec("retail", "small", 0.32, 0.10, 0.25),
    BagSpec("retail", "medium", 0.42, 0.12, 0.35),
    BagSpec("retail", "large", 0.50, 0.15, 0.45),
]


def resolve_output_dir() -> Path:
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if args:
        return Path(args[0]).expanduser().resolve()

    if "__file__" in globals():
        script_path = Path(__file__).resolve()
        return script_path.parents[2] / "public" / "models" / "bags"

    return Path.cwd() / "bag_exports"


def find_texture_dir() -> Path | None:
    candidates = [DEFAULT_FABRIC_DIR]

    if "__file__" in globals():
        script_path = Path(__file__).resolve()
        candidates.append(script_path.parents[2] / "public" / "textures" / "fabric062")

    for candidate in candidates:
        if candidate.exists():
            return candidate.resolve()

    return None


def texture_file(texture_dir: Path | None, name: str) -> Path | None:
    if texture_dir is None:
        return None

    path = texture_dir / name
    return path if path.exists() else None


def ensure_collection(name: str) -> bpy.types.Collection:
    collection = bpy.data.collections.get(name)
    if collection is None:
        collection = bpy.data.collections.new(name)

    if collection.name not in bpy.context.scene.collection.children.keys():
        bpy.context.scene.collection.children.link(collection)

    return collection


def load_image(path: Path | None, color_space: str) -> bpy.types.Image | None:
    if path is None:
        return None

    image = bpy.data.images.load(str(path), check_existing=True)
    image.colorspace_settings.name = color_space
    return image


def build_pbr_material(
    name: str,
    texture_dir: Path | None,
    base_color: tuple[float, float, float, float],
    roughness: float,
    normal_strength: float,
) -> bpy.types.Material:
    material = bpy.data.materials.get(name)
    if material is None:
        material = bpy.data.materials.new(name=name)

    material.use_nodes = True
    material.use_backface_culling = False

    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    output = nodes.new(type="ShaderNodeOutputMaterial")
    output.location = (980, 40)

    bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
    bsdf.location = (710, 40)
    bsdf.inputs["Base Color"].default_value = base_color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = 0.0
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.18
    elif "Specular" in bsdf.inputs:
        bsdf.inputs["Specular"].default_value = 0.18

    uv = nodes.new(type="ShaderNodeUVMap")
    uv.location = (-1260, 240)
    uv.uv_map = "UVMap"

    mapping = nodes.new(type="ShaderNodeMapping")
    mapping.location = (-1040, 240)

    base_rgb = nodes.new(type="ShaderNodeRGB")
    base_rgb.location = (-230, 340)
    base_rgb.outputs[0].default_value = base_color

    ao_mix = nodes.new(type="ShaderNodeMixRGB")
    ao_mix.location = (190, 250)
    ao_mix.blend_type = "MULTIPLY"
    ao_mix.inputs["Fac"].default_value = 0.33

    color_multiply = nodes.new(type="ShaderNodeMixRGB")
    color_multiply.location = (450, 250)
    color_multiply.blend_type = "MULTIPLY"
    color_multiply.inputs["Fac"].default_value = 1.0

    normal_map = nodes.new(type="ShaderNodeNormalMap")
    normal_map.location = (430, -120)
    normal_map.inputs["Strength"].default_value = normal_strength

    links.new(uv.outputs["UV"], mapping.inputs["Vector"])

    color_image = load_image(texture_file(texture_dir, "Fabric062_2K-JPG_Color.jpg"), "sRGB")
    ao_image = load_image(texture_file(texture_dir, "Fabric062_2K-JPG_AmbientOcclusion.jpg"), "Non-Color")
    roughness_image = load_image(texture_file(texture_dir, "Fabric062_2K-JPG_Roughness.jpg"), "Non-Color")
    normal_image = load_image(texture_file(texture_dir, "Fabric062_2K-JPG_NormalGL.jpg"), "Non-Color")

    if color_image is not None:
        color_tex = nodes.new(type="ShaderNodeTexImage")
        color_tex.location = (-820, 380)
        color_tex.image = color_image
        links.new(mapping.outputs["Vector"], color_tex.inputs["Vector"])
        links.new(color_tex.outputs["Color"], color_multiply.inputs["Color1"])
    else:
        links.new(base_rgb.outputs["Color"], color_multiply.inputs["Color1"])

    links.new(base_rgb.outputs["Color"], color_multiply.inputs["Color2"])

    if ao_image is not None:
        ao_tex = nodes.new(type="ShaderNodeTexImage")
        ao_tex.location = (-820, 140)
        ao_tex.image = ao_image
        links.new(mapping.outputs["Vector"], ao_tex.inputs["Vector"])
        links.new(ao_tex.outputs["Color"], ao_mix.inputs["Color2"])
    else:
        ao_mix.inputs["Color2"].default_value = (1.0, 1.0, 1.0, 1.0)

    links.new(color_multiply.outputs["Color"], ao_mix.inputs["Color1"])
    links.new(ao_mix.outputs["Color"], bsdf.inputs["Base Color"])

    if roughness_image is not None:
        roughness_tex = nodes.new(type="ShaderNodeTexImage")
        roughness_tex.location = (-820, -120)
        roughness_tex.image = roughness_image
        links.new(mapping.outputs["Vector"], roughness_tex.inputs["Vector"])
        links.new(roughness_tex.outputs["Color"], bsdf.inputs["Roughness"])

    if normal_image is not None:
        normal_tex = nodes.new(type="ShaderNodeTexImage")
        normal_tex.location = (-820, -360)
        normal_tex.image = normal_image
        links.new(mapping.outputs["Vector"], normal_tex.inputs["Vector"])
        links.new(normal_tex.outputs["Color"], normal_map.inputs["Color"])
        links.new(normal_map.outputs["Normal"], bsdf.inputs["Normal"])

    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    return material


def get_materials(texture_dir: Path | None) -> dict[str, bpy.types.Material]:
    return {
        "body": build_pbr_material(
            name="Bag Body",
            texture_dir=texture_dir,
            base_color=(0.965, 0.955, 0.93, 1.0),
            roughness=0.78,
            normal_strength=0.8,
        ),
        "handles": build_pbr_material(
            name="Handles",
            texture_dir=texture_dir,
            base_color=(0.985, 0.975, 0.95, 1.0),
            roughness=0.74,
            normal_strength=0.65,
        ),
        "piping": build_pbr_material(
            name="Piping/Edges",
            texture_dir=texture_dir,
            base_color=(0.93, 0.92, 0.89, 1.0),
            roughness=0.82,
            normal_strength=0.85,
        ),
    }


def add_mesh_object(
    name: str,
    vertices: list[tuple[float, float, float]],
    faces: list[tuple[int, ...]],
    collection: bpy.types.Collection,
) -> bpy.types.Object:
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update(calc_edges=True)

    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    return obj


def assign_world_uvs(obj: bpy.types.Object, tile_density: float = FABRIC_TILE_DENSITY) -> None:
    mesh = obj.data
    while mesh.uv_layers:
        mesh.uv_layers.remove(mesh.uv_layers[0])

    uv_layer = mesh.uv_layers.new(name="UVMap")

    for polygon in mesh.polygons:
        normal = polygon.normal.normalized()
        for loop_index in polygon.loop_indices:
            vertex_index = mesh.loops[loop_index].vertex_index
            coord = mesh.vertices[vertex_index].co

            if abs(normal.z) > 0.8:
                u = coord.x * tile_density
                v = coord.y * tile_density
            elif abs(normal.y) >= abs(normal.x):
                u = coord.x * tile_density
                v = coord.z * tile_density
            else:
                u = coord.y * tile_density
                v = coord.z * tile_density

            uv_layer.data[loop_index].uv = (u, v)


def assign_logo_uvs(
    body: bpy.types.Object,
    width: float,
    height: float,
    overscan: float,
) -> None:
    mesh = body.data
    logo_uv = mesh.uv_layers.new(name="LogoUV")

    for polygon in mesh.polygons:
        normal = polygon.normal.normalized()
        is_front_or_back = abs(normal.y) > 0.82

        for loop_index in polygon.loop_indices:
            vertex_index = mesh.loops[loop_index].vertex_index
            coord = mesh.vertices[vertex_index].co

            if is_front_or_back:
                normalized_u = (coord.x + (width / 2.0)) / width
                normalized_v = coord.z / height
                padded_u = -overscan + normalized_u * (1.0 + (overscan * 2.0))
                padded_v = -overscan + normalized_v * (1.0 + (overscan * 2.0))

                if normal.y < 0:
                    padded_u = 1.0 - padded_u

                logo_uv.data[loop_index].uv = (padded_u, padded_v)
            else:
                logo_uv.data[loop_index].uv = (0.0, 0.0)


def create_body_mesh(
    spec: BagSpec,
    material: bpy.types.Material,
    collection: bpy.types.Collection,
) -> bpy.types.Object:
    style = BAG_STYLES[spec.category]
    width = spec.width
    depth = spec.depth
    height = spec.height

    gusset_inset = min(width * style.gusset_inset_ratio, depth * 0.36)
    front_sag = height * style.front_sag_ratio
    side_sag = height * style.side_sag_ratio
    corner_lift = min(height * 0.008, 0.004)

    bottom_ring = [
        (-width / 2, depth / 2, 0.0),
        (0.0, depth / 2, 0.0),
        (width / 2, depth / 2, 0.0),
        (width / 2 - gusset_inset, 0.0, 0.0),
        (width / 2, -depth / 2, 0.0),
        (0.0, -depth / 2, 0.0),
        (-width / 2, -depth / 2, 0.0),
        (-width / 2 + gusset_inset, 0.0, 0.0),
    ]

    top_ring = [
        (-width / 2, depth / 2, height + corner_lift),
        (0.0, depth / 2, height - front_sag),
        (width / 2, depth / 2, height + corner_lift),
        (width / 2 - gusset_inset, 0.0, height - side_sag),
        (width / 2, -depth / 2, height + corner_lift),
        (0.0, -depth / 2, height - (front_sag * 0.92)),
        (-width / 2, -depth / 2, height + corner_lift),
        (-width / 2 + gusset_inset, 0.0, height - side_sag),
    ]

    vertices = bottom_ring + top_ring + [(0.0, 0.0, 0.0)]
    center_index = len(vertices) - 1

    faces = [
        (0, 1, 9, 8),
        (1, 2, 10, 9),
        (2, 3, 11, 10),
        (3, 4, 12, 11),
        (4, 5, 13, 12),
        (5, 6, 14, 13),
        (6, 7, 15, 14),
        (7, 0, 8, 15),
        (0, 1, center_index),
        (1, 2, center_index),
        (2, 3, center_index),
        (3, 4, center_index),
        (4, 5, center_index),
        (5, 6, center_index),
        (6, 7, center_index),
        (7, 0, center_index),
    ]

    body = add_mesh_object(f"{spec.object_name}_Body", vertices, faces, collection)
    body.data.materials.append(material)
    assign_world_uvs(body)
    assign_logo_uvs(body, width, height, style.print_uv_overscan)

    for polygon in body.data.polygons:
        polygon.use_smooth = False

    return body


def create_handle_mesh(
    spec: BagSpec,
    material: bpy.types.Material,
    collection: bpy.types.Collection,
) -> bpy.types.Object:
    style = BAG_STYLES[spec.category]
    width = spec.width
    depth = spec.depth
    height = spec.height

    min_dim = min(width, depth, height)
    strap_width = min(width * style.handle_width_ratio, 0.045)
    handle_spacing = width * style.handle_spacing_ratio
    attach_z = height * style.handle_attach_ratio
    arch_rise = max(height * style.handle_rise_ratio, min_dim * 0.68)
    front_y = (depth / 2) - (min_dim * 0.08)
    back_y = -(depth / 2) + (min_dim * 0.08)
    inward_shift = width * style.handle_inward_ratio
    steps = 20

    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int, int]] = []

    for side_sign in (-1.0, 1.0):
        x_anchor = side_sign * handle_spacing
        start_index = len(vertices)

        for step in range(steps + 1):
            factor = step / steps
            angle = math.sin(math.pi * factor)
            y = front_y + ((back_y - front_y) * factor)
            z = attach_z + (arch_rise * angle)
            x_center = x_anchor - (side_sign * inward_shift * angle * 0.75)
            left_x = x_center - (strap_width / 2)
            right_x = x_center + (strap_width / 2)

            vertices.append((left_x, y, z))
            vertices.append((right_x, y, z))

        for step in range(steps):
            base = start_index + (step * 2)
            faces.append((base, base + 1, base + 3, base + 2))

    handles = add_mesh_object(f"{spec.object_name}_Handles", vertices, faces, collection)
    handles.data.materials.append(material)
    assign_world_uvs(handles, tile_density=FABRIC_TILE_DENSITY * 0.8)

    for polygon in handles.data.polygons:
        polygon.use_smooth = True

    return handles


def offset_point(point: Vector, offset_dir: Vector, distance: float) -> Vector:
    if offset_dir.length == 0:
        return point.copy()
    return point + (offset_dir.normalized() * distance)


def add_quad(
    vertices: list[tuple[float, float, float]],
    faces: list[tuple[int, int, int, int]],
    a: Vector,
    b: Vector,
    c: Vector,
    d: Vector,
) -> None:
    start = len(vertices)
    vertices.extend([tuple(a), tuple(b), tuple(c), tuple(d)])
    faces.append((start, start + 1, start + 2, start + 3))


def add_poly_strip(
    vertices: list[tuple[float, float, float]],
    faces: list[tuple[int, int, int, int]],
    points: list[Vector],
    edge_offset: Vector,
    drop_z: float,
) -> None:
    start = len(vertices)

    for point in points:
        top_point = point + edge_offset
        lower_point = Vector((top_point.x, top_point.y, top_point.z - drop_z))
        vertices.append(tuple(top_point))
        vertices.append(tuple(lower_point))

    for point_index in range(len(points) - 1):
        base = start + (point_index * 2)
        faces.append((base, base + 2, base + 3, base + 1))


def create_piping_mesh(
    spec: BagSpec,
    material: bpy.types.Material,
    collection: bpy.types.Collection,
) -> bpy.types.Object:
    style = BAG_STYLES[spec.category]
    width = spec.width
    depth = spec.depth
    height = spec.height
    min_dim = min(width, depth, height)

    gusset_inset = min(width * style.gusset_inset_ratio, depth * 0.36)
    front_sag = height * style.front_sag_ratio
    side_sag = height * style.side_sag_ratio
    corner_lift = min(height * 0.008, 0.004)
    piping_width = max(min_dim * style.piping_width_ratio, 0.0045)
    seam_band = max(min_dim * style.seam_band_ratio, 0.006)
    edge_offset = max(min_dim * 0.01, 0.001)

    top_ring = [
        Vector((-width / 2, depth / 2, height + corner_lift)),
        Vector((0.0, depth / 2, height - front_sag)),
        Vector((width / 2, depth / 2, height + corner_lift)),
        Vector((width / 2 - gusset_inset, 0.0, height - side_sag)),
        Vector((width / 2, -depth / 2, height + corner_lift)),
        Vector((0.0, -depth / 2, height - (front_sag * 0.92))),
        Vector((-width / 2, -depth / 2, height + corner_lift)),
        Vector((-width / 2 + gusset_inset, 0.0, height - side_sag)),
    ]

    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int, int]] = []

    corner_specs = [
        (Vector((-width / 2, depth / 2, 0.0)), top_ring[0], Vector((-1.0, 1.0, 0.0))),
        (Vector((width / 2, depth / 2, 0.0)), top_ring[2], Vector((1.0, 1.0, 0.0))),
        (Vector((width / 2, -depth / 2, 0.0)), top_ring[4], Vector((1.0, -1.0, 0.0))),
        (Vector((-width / 2, -depth / 2, 0.0)), top_ring[6], Vector((-1.0, -1.0, 0.0))),
    ]

    for bottom_point, top_point, diagonal in corner_specs:
        center_bottom = offset_point(bottom_point, diagonal, edge_offset)
        center_top = offset_point(top_point, diagonal, edge_offset)
        width_vec = diagonal.normalized() * (piping_width / 2)
        add_quad(
            vertices,
            faces,
            center_bottom - width_vec,
            center_bottom + width_vec,
            center_top + width_vec,
            center_top - width_vec,
        )

    add_poly_strip(
        vertices,
        faces,
        [top_ring[0], top_ring[1], top_ring[2]],
        Vector((0.0, edge_offset, 0.0)),
        seam_band,
    )
    add_poly_strip(
        vertices,
        faces,
        [top_ring[2], top_ring[3], top_ring[4]],
        Vector((edge_offset, 0.0, 0.0)),
        seam_band,
    )
    add_poly_strip(
        vertices,
        faces,
        [top_ring[4], top_ring[5], top_ring[6]],
        Vector((0.0, -edge_offset, 0.0)),
        seam_band,
    )
    add_poly_strip(
        vertices,
        faces,
        [top_ring[6], top_ring[7], top_ring[0]],
        Vector((-edge_offset, 0.0, 0.0)),
        seam_band,
    )

    piping = add_mesh_object(f"{spec.object_name}_Piping", vertices, faces, collection)
    piping.data.materials.append(material)
    assign_world_uvs(piping, tile_density=FABRIC_TILE_DENSITY * 1.05)

    for polygon in piping.data.polygons:
        polygon.use_smooth = True

    return piping


def export_selected_objects(filepath: Path, objects: list[bpy.types.Object]) -> None:
    bpy.ops.object.select_all(action="DESELECT")

    for obj in objects:
        obj.select_set(True)

    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.export_scene.gltf(
        filepath=str(filepath),
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_texcoords=True,
        export_normals=True,
        export_tangents=True,
        export_materials="EXPORT",
    )


def remove_objects(objects: list[bpy.types.Object]) -> None:
    for obj in objects:
        if obj.name in bpy.data.objects:
            bpy.data.objects.remove(obj, do_unlink=True)


def build_and_export_bag(
    spec: BagSpec,
    materials: dict[str, bpy.types.Material],
    output_dir: Path,
) -> Path:
    collection = ensure_collection(GEN_COLLECTION_NAME)

    body = create_body_mesh(spec, materials["body"], collection)
    handles = create_handle_mesh(spec, materials["handles"], collection)
    piping = create_piping_mesh(spec, materials["piping"], collection)

    export_path = output_dir / spec.filename
    export_selected_objects(export_path, [body, handles, piping])
    remove_objects([body, handles, piping])
    return export_path


def main() -> None:
    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 1.0

    output_dir = resolve_output_dir()
    output_dir.mkdir(parents=True, exist_ok=True)

    texture_dir = find_texture_dir()
    materials = get_materials(texture_dir)

    exported_files = []
    for spec in BAG_SPECS:
        export_path = build_and_export_bag(spec, materials, output_dir)
        exported_files.append(export_path)
        print(f"Exported {export_path}")

    print(f"Finished exporting {len(exported_files)} bags to {output_dir}")


if __name__ == "__main__":
    main()
