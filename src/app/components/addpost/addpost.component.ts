import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import {  Subscription, Subject, EMPTY } from "rxjs";
import {  debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post';
import { Router, ActivatedRoute, ParamMap, UrlHandlingStrategy } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: "app-addpost",
  templateUrl: "./addpost.component.html",
  styleUrls: ["./addpost.component.css"],
})
export class AddpostComponent implements OnInit,OnDestroy {
  isLoading: boolean =  false;
  updatePost = new Post;
  media_error:string;
  addPostForm: FormGroup;
  mode_create: boolean = true;
  options: string[] = ["Location 1", "Location 2", "Location 3"];
  image_preview: string[] = [];
  video_preview: string[] = [];
  image_preview_old: string[] = [];
  video_preview_old: string[] = [];
  postId: string;
  validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
  validVideoTypes = [ "video/mp4" ];
  searchOptions:{ _id: string; name: string }[];
  searchSubscription : Subscription;
  searchSubject = new Subject<any>();
  selectedLocation;
  location = new FormControl;

  constructor(private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    public domSanitizer: DomSanitizer,
    private locationService: LocationService) {}

  ngOnInit() {
    this.addPostForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      locationId: ["", Validators.required],
      images: this.fb.array([]),
      videos: this.fb.array([]),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode_create = false;
        this.postId = paramMap.get('postId');
        this.postService.getPostById(this.postId).subscribe(response => {
          this.updatePost = response;
          this.image_preview_old = response.imagesPaths;
          this.video_preview_old = response.videosPaths;
          this.addPostForm.patchValue(response);
          this.optionSelected(response.locationId)
        });
      }
      if(paramMap.has('locationId')){
        this.optionSelected(paramMap.get('locationId'));
      }
    });

    this.searchSubscription = this.searchSubject.pipe(debounceTime(450), distinctUntilChanged(),switchMap(query => {
      if(query) {
        return this.locationService.searchLocation(query);
      }
      else {
        this.searchOptions = null;
        return EMPTY;
      }
    })).subscribe(response => {
      this.searchOptions = response.result;
    })
  }

  get locationId() {
    return this.addPostForm.get("locationId");
  }

  get title() {
    return this.addPostForm.get("title");
  }

  onKeyUpSearch(query: string) {
    this.searchSubject.next(query);
  }

  get description() {
    return this.addPostForm.get("description");
  }

  get images() {
    return this.addPostForm.get("images") as FormArray;
  }

  get videos() {
    return this.addPostForm.get("videos") as FormArray;
  }

  uploadImages(event: any) {
    this.media_error = '';
    let files = event.target.files;
    let files_length = files.length;
    for (let i = 0; i < files_length; i++) {
      const fileType = files[i]['type'];
      if (this.validImageTypes.includes(fileType)) {
        if(files[i]['size'] > 15728640 ) {
          this.media_error = "Video File Size Should be Less than 60MB & Image Size Should be less than 15MB";
          return;
        }
        let reader = new FileReader();
        reader.onload = () => {
          this.image_preview.push(reader.result + "");
          console.log(reader.result + '');
        };
        reader.readAsDataURL(files[i]);
        this.images.push(this.fb.control(files[i]));
      }
      else if (this.validVideoTypes.includes(fileType)) {
        if(files[i]['size'] > 62914560 ) {
          this.media_error = "Video File Size Should be Less than 60MB & Image Size Should be less than 15MB";
          return;
        }
        // let reader = new FileReader();
        // reader.onload = (e) => {
        //   this.video_preview.push(reader.result + "");
        // };
        // reader.readAsDataURL(files[i]);
        const blobUrl = URL.createObjectURL(files[i])
        this.video_preview.push(blobUrl);
        this.videos.push(this.fb.control(files[i]));
      }
      else {
        this.media_error = "Please upload proper Media Files";
      }
    }
    setTimeout(()=> {
      for (let i = 0; i < this.video_preview.length; i++) {
        URL.revokeObjectURL(this.video_preview[i]);
      }
    },5000)
  }

  displayfn(subject) {
    return subject ? subject.name : undefined;
  }

  removeImage(i:number) {
    this.images.removeAt(i);
    this.image_preview.splice(i, 1);
  }

  removeVideo(i:number){
    this.videos.removeAt(i);
    this.video_preview.splice(i, 1);
  }

  removeOldImage(i:number){
    this.image_preview_old.splice(i,1);
  }

  removeOldVideo(i:number){
    this.video_preview_old.splice(i,1);
  }

  onAddPost() {
    // this.isLoading = true;
    if (this.addPostForm.invalid) {
      return ;
    }
    if (this.mode_create) {
      this.postService.addPost(this.addPostForm.value).subscribe(result =>{
        console.log('result', result);
        this.router.navigate(['/']);
      });
    }
    else {
      this.updatePost = this.addPostForm.value;
      this.updatePost._id = this.postId;
      this.updatePost.imagesPaths = this.image_preview_old;
      this.updatePost.videosPaths = this.video_preview_old;
      console.log(this.updatePost);
      this.postService.updatePost(this.updatePost, this.postId).subscribe(updatedPost => {
        console.log('Post Updated Succesfully', updatedPost);
        this.router.navigate(['/']);
      });
    }
  }

  optionSelected(id: string) {
    this.locationId.setValue(id);
    this.addPostForm.updateValueAndValidity();
    console.log(this.addPostForm.value);
    this.locationService.getLocationPreview(id).subscribe((response: any) => {
      this.selectedLocation = response.result;
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  changeLocation() {
    this.locationId.setValue(null);
    this.location.setValue(null);
  }
}
