/* eslint-disable react/jsx-key */
'use client'
import Layout from '@/components/layout'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { withSwal } from 'react-sweetalert2';
function Categories({swal}) {
  useEffect(()=>{
    fetchCategories();
  },[]);
const[name,setName] = useState('');
const [editedCategory, setEditedCategory] = useState(null);
const [categories,setCategories]= useState([]);
const [parentCategory,setParentCategory]=useState('');
const [properties,setProperties]= useState([]);
async function saveCategories(e){
  e.preventDefault();
  const data = {name,
    parentCategory,
    properties: properties.map(p =>({name: p.name,
      values:p.values.split(','),
  }))
  }
  if(editedCategory){
    data._id = editedCategory._id;
    await axios.put('/api/Categories',data);
    setEditedCategory(null);
  } else{
    await axios.post('/api/Categories',data);
  }
 setParentCategory('');
setProperties([]);
setName('');
fetchCategories();
}
async function fetchCategories(){
 await axios.get('/api/Categories').then(result =>{
    setCategories(result.data);
  });
}
function editCategory(Category){
setEditedCategory(Category);
setName(Category.name);
setParentCategory(Category.parent?._id);
setProperties(Category.properties.map(({name,values}) =>({
name,
values:values.join(',')
}
)))
}
async function deleteCategory(Category){
  swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete ${Category.name}?`,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes, Delete!',
    confirmButtonColor: '#d55',
    reverseButtons: true,
  }).then(async result => {
   if(result.isConfirmed){
    const {_id}=Category;
    await axios.delete('/api/Categories?_id='+_id,_id);
    fetchCategories();
   }
  });
}
function addProperty(){
  setProperties(prev => {
   return [...prev, {name:'',values:''}]
  });
}
function handelPropertyNameChange(index,property,newName){
setProperties(prev => {
  const properties =[...prev];
  properties[index].name = newName;
  return properties;
});
}
function handelPropertyValuesChange(index,property,newValues){
  setProperties(prev => {
    const properties =[...prev];
    properties[index].values = newValues;
    return properties;
  });
}
function removeProperty(indexToRemove) {
  setProperties(prev => {
    return [...prev].filter((p,pIndex) => {
      return pIndex !== indexToRemove;
    });
  });
}
  return (
    <Layout>
    <h1>Categories</h1>
    <label>  {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}</label>

    <form onSubmit={saveCategories} >
    <div className='flex gap-1'>
    <input  
    type='text' placeholder={'Category name'} 
    value={name}
     onChange={e=>setName(e.target.value)}>

     </input>
    <select 
    onChange={e=> setParentCategory(e.target.value)}
    value={parentCategory}>
      <option value='0'> NO parent category</option>
    {categories.length > 0 && categories.map(Category=>(
        // eslint-disable-next-line react/jsx-key
        
         // eslint-disable-next-line react/jsx-key
         <option value={Category._id}>{Category.name}</option>
       
        ))}
    </select>
    </div>
       <div className='mb-2'>
        <label className='block'>properties</label>
        <button
        onClick={addProperty}
         type='button'
        className='btn-default text-sm mb-2'>
          add new property
          </button>
          {properties.length > 0 && properties.map((property,index) =>(
            <div className='flex gap-1 mb-2'>
              <input className='mb-0' type='text'
              value={property.name}
              onChange={e=> handelPropertyNameChange(index,property,e.target.value)}
               placeholder='property name (ex:color)'/>
              <input className='mb-0'
               type='text'
              value={property.values}
              onChange={e=> handelPropertyValuesChange(index,property,e.target.value)}
               placeholder='Values, comma separated'/>
               <button 
               type='button'
               onClick={()=>removeProperty(index)}
               className='btn-default'>
                Remove
                </button>
            </div>
          ))}
       </div>
       <div className='flex gap-1'>
       {editedCategory &&(
        <button 
        type='button'
        onClick={()=>{setEditedCategory(null);
          setName('');
          setParentCategory('');
          setProperties([]);
        }}
        className='btn-default'>
Cancel
</button>
       )}
       
    <button type='submit'
     className='btn-primary' >
      Save
      </button>
       </div>
       
    </form>
    {!editedCategory && (
      <table className='basic mt-4'>
      <thead>
        <tr>
          <td>
            Category name
          </td>
          <td>Parent Category</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {categories.length > 0 && categories.map(Category=>(
        // eslint-disable-next-line react/jsx-key
        <tr>
          <td>
            {Category.name}
          </td>
         <td> {Category.parent?.name}</td>
         <td>
          <button className='btn-primary mr-1' onClick={()=>editCategory(Category)}>Edit</button>
          <button onClick={() => deleteCategory(Category)}
           className='btn-red'>Delete</button>
         </td>
        </tr>
        ))}
      </tbody>
    </table>
    )}
    
    </Layout>
  );
}


export default withSwal(({swal}, ref) => (
  <Categories swal={swal} />
));