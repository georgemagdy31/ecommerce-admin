import { Category } from "@/Model/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST(request){
   await mongooseConnect();
    const{name,parentCategory,properties}=await request.json();
    const categoryDocs = await Category.create({name,
        parent:parentCategory || undefined,
        properties});
    return NextResponse.json(categoryDocs);
}

export async function GET(request){
    await mongooseConnect();
       return NextResponse.json(await Category.find().populate('parent'));
}
export async function PUT(request){
    await mongooseConnect();
     const{name,parentCategory,_id,properties}=await request.json();
     const categoryDocs = await Category.updateOne({_id},{name,
        parent:parentCategory || undefined
        ,properties});
     return NextResponse.json(categoryDocs);
 }
 export async function DELETE(request) {
    await mongooseConnect();
    const searchParams = request.nextUrl.searchParams// Use 'search' instead of 'searchParams'
    const id = searchParams.get('_id'); // Remove the destructuring assignment
    await Category.deleteOne({_id:id});
    return NextResponse.json(true);
  }
 