export interface ImageModel {
    id: number;
    date: string;
    desc: string;
    imageDetails: DetailModels[];
}

export interface DetailModels {
    id: number;
    imageLink: string;
}