import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/Model/Product";
import { NextResponse } from "next/server";

export  async function POST(request) {
  await mongooseConnect();
  const {title,description,price,images,category, properties} = await request.json()
  const productDoc = await Product.create({
    title,description,price,images,category, properties
        });
return NextResponse.json(productDoc);
  }

  
  export async function GET(request) {
    await mongooseConnect();
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
  
  if(id){
    return NextResponse.json(await Product.findOne({_id:id}));
   }
   else{
    return NextResponse.json(await Product.find());
   }
    
  }
 
  export  async function PUT(request) {
    await mongooseConnect();
    const {title,description,price,_id,images,category, properties} = await request.json();
    await Product.updateOne({_id},{title,description,price,images,category, properties});
    return NextResponse.json(true);
  }
  
  export  async function DELETE(request){
    await mongooseConnect();
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
  
  
    await Product.deleteOne({_id:id});
    return NextResponse.json(true);
   }
  
