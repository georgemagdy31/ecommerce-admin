/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
'use client'
import { UploadButton } from '@/app/utils/uploadthing';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ReactSortable } from 'react-sortablejs';
const ProductForm = ({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties,
}) => {
    const [title,setTitle] = useState(existingTitle || '');
  const [description,setDescription] = useState(existingDescription || '');
  const [price,setPrice] = useState(existingPrice || '');
    const [goToProducts,setGoToProducts] = useState(false);
    const [images,setImages] = useState(existingImages || []);
    const[categories,setCategories] = useState([]);
    const [category,setCategory] = useState(assignedCategory||'');
    const [productProperties,setProductProperties] = useState(assignedProperties||{});
    const router = useRouter();
    useEffect(()=>{
axios.get('/api/Categories').then(res => {
  setCategories(res.data);
})
    },[])
    async function createProduct(e){
        e.preventDefault();
        const data ={title,description,price,images,category,
          properties:productProperties};
        if(_id){
            
            await axios.put('/api/products',{... data,_id});
        }
        else{
        
            await axios.post('/api/products', data);
           
        }
        setGoToProducts(true);
}
if(goToProducts){
 router.push('/products');
}
 
function updateImagesOrder(images){
  setImages(images);
}
 
 const propertiesToFill = [];
 if (categories.length > 0 && category) {
   let catInfo = categories.find(({_id}) => _id === category);
   propertiesToFill.push(...catInfo.properties);
   while(catInfo?.parent?._id) {
     const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
     propertiesToFill.push(...parentCat.properties);
     catInfo = parentCat;
   }
}
function setProductProp(propName,value) {
  setProductProperties(prev => {
    const newProductProps = {...prev};
    newProductProps[propName] = value;
    return newProductProps;
  });
}
  return (
    
        <form onSubmit={createProduct}>
        
        <label>Product name</label>
        <input type='text' placeholder='Product name' value={title} onChange={(e) => setTitle(e.target.value)}/>
        <label>Category</label>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value=''>UnCategorized</option>
          {categories.length && categories.map(c=>(
          
          <option value={c._id}>{c.name}</option>
          
          ))}
        </select>
        {propertiesToFill.length >0 && propertiesToFill.map(p =>(
          <div className='flex gap-1'>
           <div> {p.name}</div>
           <select 
            value={productProperties[p.name]} 
            onChange={e =>
                        setProductProp(p.name,e.target.value)
                      } >
            {p.values.map(v=>(
<option value={v}> {v} </option>
            ))}
           </select>
            </div>
        ))}
        <label>
          Photos
        </label>
        <div className="mb-2 flex">
  <ReactSortable  className="flex flex-wrap "  list={images} setList={updateImagesOrder}>
         {!!images?.length && images.map(link =>(
        <div className='h-24 w-24 flex' key={link}>
<img src={link} alt=""/>
        </div>
       )) }
       </ReactSortable>
          <label className=' text-center flex items-center text-sm gap-1'>
          <UploadButton  
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          // Do something with the response
          const data = res?.[0];
         const Axiosres = await axios.post('/api/upload', data);
         setImages(oldImages => {
          return [...oldImages, ...Axiosres.data.Links];
        });
        }}
        
        />
        </label>
        </div>
        <label>Description</label>
        <textarea placeholder='description' value={description} onChange={(e) => setDescription(e.target.value)}/>
        <label>Price (in USD) </label>
        <input type='number' placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)}/>
        <button type='submit' className='btn-primary'>Save</button>
        </form>
   
  )
}

export default  ProductForm