import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private post_url:string;

  constructor(private http: HttpClient) {
    this.post_url = "http://localhost:3000/api/post/";
  }

  addPost(postData) {
    const formData = new FormData();
    for(let i =0; i < postData.images.length; i++){
      formData.append("images", postData.images[i], postData.images[i]['name']);
    }
    for(let i =0; i < postData.videos.length; i++){
      formData.append("videos", postData.videos[i], postData.videos[i]['name']);
    }
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('locationId', postData.locationId);
    return this.http.post<any>(this.post_url, formData);
  }

  updatePost(updatedPost, postId){
    const formData = new FormData();
    for(let i =0; i < updatedPost.images.length; i++){
      formData.append("images", updatedPost.images[i], updatedPost.images[i]['name']);
    }
    for(let i =0; i < updatedPost.videos.length; i++){
      formData.append("videos", updatedPost.videos[i], updatedPost.videos[i]['name']);
    }
    for(let i =0; i < updatedPost.imagesPaths.length; i++){
      formData.append("imagesPaths",  updatedPost.imagesPaths[i]);
    }
    for(let i =0; i < updatedPost.videosPaths.length; i++){
      formData.append("videosPaths", updatedPost.videosPaths[i]);
    }
    formData.append('title', updatedPost.title);
    formData.append('description', updatedPost.description);
    formData.append('locationId', updatedPost.locationId);
    formData.append('_id', updatedPost._id);
    // formData.append('imagesPaths', updatedPost.imagesPaths);
    // formData.append('videosPaths', updatedPost.videosPaths);
    return this.http.put<Post>(`${this.post_url}${postId}`,formData);
  }

  getPosts() {
    return this.http.get<Post[]>(this.post_url);
  }

  getPostById(id:string) {
    return this.http.get<Post>(`${this.post_url}${id}`);
  }

  deletePost(id: string) {
  return this.http.delete<Post>(`${this.post_url}${id}`);
  }

  getPostsByUserId(userId: string) {
    return this.http.get<{success: boolean, result: Post[]}>(`${this.post_url}by-user/${userId}`)
  }

  getPostsByLocationId(locationId: string) {
    return this.http.get<{success: boolean, result: Post[]}>(`${this.post_url}by-location/${locationId}`)
  }

}
