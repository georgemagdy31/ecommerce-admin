'use client'
import ProductForm from "@/components/ProductForm";
import Layout from "@/components/layout";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProductPage(){
    const [productInfo, setProductinfo] = useState(null);
    const router= useRouter();
const params = useParams();
const {id} = params
   useEffect(()=>{
    if(!id){
        return;
    }
    axios.get('/api/products?id='+id).then(response=>{
        setProductinfo(response.data);
    });
   },[id]);
    return(
        <Layout>
            <h1>Edit product</h1>
            {productInfo && (<ProductForm {...productInfo}/>)}
            
        </Layout>
    );
}