export interface GifImageVariant {
  url: string;
  width?: string;
  height?: string;
}

export interface GifImages {
  fixed_height: GifImageVariant;
  original: GifImageVariant;
  downsized?: GifImageVariant;
}

export interface Gif {
  id: string;
  title: string;
  url: string;
  images: GifImages;
}

export interface GiphyPagination {
  total_count: number;
  count: number;
  offset: number;
}

export interface GiphyMeta {
  status: number;
  msg: string;
}

export interface GiphyResponse {
  data: Gif[];
  pagination: GiphyPagination;
  meta: GiphyMeta;
}
