import {PostModel} from './instagram.model';

export interface InstaResModel{
  success: boolean
  username: string
  posts: PostModel[]
}
