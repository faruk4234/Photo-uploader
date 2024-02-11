export type photeResponseType = { 
    id:string,
    tags: Array<string>,
    photo_url:string ,
    filename:string,
    is_public:boolean,
    user_id:string,
    upload_date:Date
};

export type UserRegisterResponseType={name:string, email:string }