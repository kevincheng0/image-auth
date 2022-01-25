import React, { useState } from "react";
import { useNavigate } from "react-router";
 
export default function Create() {
  const [form, setForm] = useState({
    description: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  
  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }


  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
  
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newImage = { ...form };

    await fetch("http://localhost:5000/record/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newImage),
    })
    .catch(error => {
      window.alert(error);
      return;
    });
  
    setForm({ description: "", image: ""});
    navigate("/");
  }
  
  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h3>Create New Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={(e) => {
              var img = e.target.files[0];
              console.log(img);
              setSelectedImage(img);

              var reader = new FileReader();
              reader.onload = function(res) {
                var base64 = res.explicitOriginalTarget.result.replace(/^data:image.+;base64,/, '');
                console.log(base64);
                updateForm({ image: base64 });
              };
              reader.readAsDataURL(img);
            }}
          />
        </div>
        <div>
          {selectedImage && (
            <div>
            {/* <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} /> */}
            <img alt="not found" width={"250px"} src={`data:image/jpeg;base64,${form.image}`} />
            <br />
            <button onClick={()=>setSelectedImage(null)}>Remove</button>
            </div>
          )}
          <br />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Add Image"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}