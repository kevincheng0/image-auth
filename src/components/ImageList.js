import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 
const Record = (props) => (
  <tr>
    <td>{props.record.description}</td>
    <td>
      <img alt="not found" width={"250px"} src={`data:image/jpeg;base64,${props.record.image}`} />
    </td>
    <td>
      <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> |
      <button className="btn btn-link"
        onClick={() => {
          props.deleteImage(props.record._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);
 
export default function ImageList() {
  const [images, setImages] = useState([]);
  
  // This method fetches the images from the database.
  useEffect(() => {
    async function getImages() {
      const response = await fetch(`http://localhost:5000/record/`);
      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const images = await response.json();
      setImages(images);
    }
  
    getImages();
  
    return;
  }, [images.length]);
  
  // This method will delete a record
  async function deleteImage(id) {
    await fetch(`http://localhost:5000/${id}`, {
      method: "DELETE"
    });
  
    const newImages = images.filter((el) => el._id !== id);
    setImages(newImages);
  }
  
  // This method will map out the records on the table
  function ImageList() {
    return images.map((image) => {
      return (
        <Record
          record={image}
          deleteImage={() => deleteImage(image._id)}
          key={image._id}
        />
      );
    });
  }
  
  return (
    <div>
      <h3>                               Image List</h3>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>{ImageList()}</tbody>
      </table>
    </div>
  );

  // // This following section will display the table with the records of individuals.
  // return (
  //   <div>
  //     <h3>                               Image List</h3>
  //     <table className="table table-striped" style={{ marginTop: 20 }}>
  //       <thead>
  //         <tr>
  //           <th>Name</th>
  //           <th>Position</th>
  //           <th>Level</th>
  //           <th>Action</th>
  //         </tr>
  //       </thead>
  //       <tbody>{recordList()}</tbody>
  //     </table>
  //   </div>
  // );
}