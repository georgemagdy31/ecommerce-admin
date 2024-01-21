/* eslint-disable react/no-unescaped-entities */
"use client"
import Layout from "@/components/layout";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DeleteProductPage(){
    const router = useRouter();
    const params = useParams();
    const {id} = params
    const [productInfo, setProductinfo] = useState();
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response=>{
            setProductinfo(response.data);
        });
       },[id]);

    function goBack(){
router.push('/products');
    }
  async function deleteProduct(){
await axios.delete('/api/products?id='+id);
goBack();
  }
  
return(
    <Layout>
        <h1 className="text-center">do u want to delete "{productInfo?.title}"?</h1>
        <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>Yes</button>
        <button className="btn-default" onClick={goBack}>No</button>
        </div>
       
    </Layout>
);
}