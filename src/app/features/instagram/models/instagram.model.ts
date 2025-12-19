export interface PostModel {
  id: string
  label: string
  is_product: boolean
  caption: string
  media: Medum[]
}

export interface Medum {
  type: string
  url: string
}

