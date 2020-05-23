export class Post {
  _id:string;
  title: string;
  description: string;
  locationId: any;
  images: File[] | null;
  videos: File[] | null;
  imagesPaths: string[];
  videosPaths: string[];
  creatorId: any;
}

