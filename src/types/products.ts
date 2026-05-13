/** Product category (top-level grouping) */
export type ProductCategory = 'tote' | 'retail';
export type BagFamily = 'pizza' | 'takeaway' | 'retail' | 'tote';
export type BagSize = 'small' | 'medium' | 'large';

export interface BagDimensions {
  /** Width in meters */
  width: number;
  /** Depth in meters */
  depth: number;
  /** Height in meters */
  height: number;
}

export interface BagPrintArea {
  /** Relative vertical center for the logo plane */
  centerHeightRatio: number;
  /** Relative logo size compared to the bag width */
  logoWidthRatio: number;
  /** Relative text size compared to the bag width */
  textWidthRatio: number;
  /** Vertical gap between logo and text */
  textOffsetRatio: number;
}

/** Specific bag variant within a category */
export interface BagVariant {
  id: string;
  category: ProductCategory;
  /** Bag family grouping shown as the top-level selector */
  family: BagFamily;
  /** Size within the selected family */
  size: BagSize;
  /** Translation key for the variant name (e.g., "products.retail.pizza.name") */
  nameKey: string;
  /** Translation key for the variant description */
  descriptionKey: string;
  /** Human-readable size label shown in the configurator */
  sizeLabel?: string;
  /** Default logo scale multiplier for this bag */
  defaultLogoScale?: number;
  /** Available colors for this variant */
  colors: BagColor[];
  /** Default selected color ID */
  defaultColorId: string;
  /** Path to placeholder image (replaced later with 3D model ref) */
  placeholderImage: string;
  /** Future: path to 3D model file */
  modelPath?: string;
  /** Real-world dimensions used to stage the 3D scene */
  dimensions?: BagDimensions;
  /** Where the logo/text overlay should sit on the bag */
  printArea?: BagPrintArea;
  /** Whether text input is supported */
  supportsText: boolean;
  /** Whether logo upload is supported */
  supportsLogo: boolean;
}

export interface BagColor {
  id: string;
  /** Translation key for color name */
  nameKey: string;
  /** Hex color value for the swatch */
  hex: string;
  /** Tailwind class for previews */
  twClass: string;
}

/** The full product catalog structure */
export interface ProductCatalog {
  categories: {
    id: ProductCategory;
    /** Translation key for category name */
    nameKey: string;
    /** Translation key for category description */
    descriptionKey: string;
    /** Translation key for category tagline */
    taglineKey: string;
    /** Placeholder image for the category card */
    image: string;
    variants: BagVariant[];
  }[];
}
