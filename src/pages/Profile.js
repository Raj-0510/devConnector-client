import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { profileSchema } from "../validationSchema/profileValidation";
import { useLocation, useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import Dashboard from "./Dashboard";
import DeleteProfileModalOpen from "../components/DeleteProfileModal";
import MobileSidebar from "../components/MobileSidebar";
import Navbar from "../components/Navbar";
import { baseURI } from "../common/baseURI";

function Profile() {
  const location = useLocation();
  const userId = location.state?._id || localStorage.getItem("userId");
  const readonlyMode = location.state?._id ? true : false;
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    userName: "",
    skills: "",
    bio: "",
    experience: [{ company: "", position: "", duration: "" }],
    githubLink: "",
    linkedInLink: "",
    image: null,
  });
  const [isSaved, setIsSaved] = useState(false);

  const [deleteProfileModalOpen, setDeleteProfileModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const getProfileData = async () => {
    try {
      const url =
        userId === undefined
          ? baseURI+"/api/user-profile/get-user-profile/me"
          : baseURI+`/api/user-profile/get-user-profile-by-id/${userId}`;
      const response = await axios.get(url, { withCredentials: true });

      const data = response?.data?.data;
      setIsSaved(!!data);

      // Set preview URL only if image exists
      if (data?.image) {
        setPreviewImage(
          baseURI+`/${data.image.replace(/\\/g, "/")}`
        );
      }

      setInitialValues({
        userName: data?.userName || "",
        skills: data?.skills || "",
        bio: data?.bio || "",
        githubLink: data?.githubLink || "",
        linkedInLink: data?.linkedInLink || "",
        experience: data?.experience?.length
          ? data.experience
          : [{ company: "", position: "", duration: "" }],
        image: null,
      });
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const submitHandler = async (values) => {
    try {
      const formData = new FormData();
      formData.append("userName", values.userName);
      formData.append("bio", values.bio);
      formData.append("skills", values.skills);
      formData.append("githubLink", values.githubLink);
      formData.append("linkedInLink", values.linkedInLink);
      if (values.image) {
        formData.append("image", values.image);
      }

      values.experience.forEach((exp, index) => {
        formData.append(`experience[${index}][company]`, exp.company);
        formData.append(`experience[${index}][position]`, exp.position);
        formData.append(`experience[${index}][duration]`, exp.duration);
      });

      const apiURL = isSaved
        ? baseURI+"/api/user-profile/update-user-profile"
        : baseURI+"/api/user-profile/create-user-profile";

      const method = isSaved ? axios.put : axios.post;

      const response = await method(apiURL, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.msg);
      navigate("/dashboard")
      getProfileData();
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      console.error("Submit error:", error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <>
      <div className="hidden md:block"> <Navbar /></div>
      <div className="block md:hidden"><MobileSidebar /></div>
      <div className="max-w-3xl mx-auto mt-6 px-2 sm:px-4 space-y-6">
</div>
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Tabs.Root defaultValue="profile" className="w-full">
        <Tabs.List className="flex space-x-4 border-b">
          <Tabs.Trigger
            value="profile"
            className="px-4 py-2 text-md font-medium text-grey-600  hover:text-black border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black"
          >
            Profile Details
          </Tabs.Trigger>
          <Tabs.Trigger
            value="posts"
            className="px-4 py-2 text-md font-medium text-grey-600 hover:text-black border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black"
          >
            Posts
          </Tabs.Trigger>
        </Tabs.List>
         <Tabs.Content value="profile">
          {initialValues?.userName!=="" && !readonlyMode &&<div className="flex">
            <button
              className="text-white ml-auto bg-red-600 rounded-md px-3 py-1 mt-2 flex items-center gap-2"
              onClick={() => {
                setDeleteProfileModalOpen(true);
              }}
            >
              Delete Profile <Trash className="w-4 h-4" />
            </button>
          </div>}

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={profileSchema}
            onSubmit={submitHandler}
          >
            {({ values, setFieldValue }) => (
              <Form className="flex gap-8 mt-2">
                {/* Image Section */}
                <div className="w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 mb-4">
                    {values.image ? (
                      <img
                        src={URL.createObjectURL(values.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : previewImage ? (
                      <img
                        src={previewImage}
                        alt="Saved Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  {readonlyMode ? (
                    <></>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFieldValue("image", e.currentTarget.files[0])
                      }
                      className="text-sm"
                    />
                  )}
                </div>

                {/* Form Fields */}
                <div className="w-2/3 space-y-4">
                  <div>
                    <label htmlFor="skills" className="block font-medium mb-1">
                      User Name:
                    </label>{" "}
                    <Field
                      name="userName"
                      placeholder="Name"
                      className="w-full p-2 border rounded"
                      disabled={readonlyMode}
                    />
                    <ErrorMessage
                      name="userName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="skills" className="block font-medium mb-1">
                      Skills:
                    </label>
                    <Field
                      name="skills"
                      placeholder="Skills (comma separated)"
                      className="w-full p-2 border rounded"
                      disabled={readonlyMode}
                    />
                    <ErrorMessage
                      name="skills"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="skills" className="block font-medium mb-1">
                      Bio:
                    </label>
                    <Field
                      as="textarea"
                      name="bio"
                      placeholder="Bio"
                      className="w-full p-2 border rounded"
                      disabled={readonlyMode}
                    />
                    <ErrorMessage
                      name="bio"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <FieldArray name="experience">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        <label className="font-semibold">Experience:</label>
                        {values.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-2 items-center relative"
                          >
                            <div>
                              <Field
                                name={`experience[${index}].company`}
                                placeholder="Company"
                                className="p-2 border rounded w-full"
                                disabled={readonlyMode}
                              />
                              <ErrorMessage
                                name={`experience[${index}].company`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>
                            <div>
                              <Field
                                name={`experience[${index}].position`}
                                placeholder="Position"
                                className="p-2 border rounded w-full"
                                disabled={readonlyMode}
                              />
                              <ErrorMessage
                                name={`experience[${index}].position`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-full">
                                <Field
                                  name={`experience[${index}].duration`}
                                  placeholder="Duration"
                                  className="p-2 border rounded w-full"
                                  disabled={readonlyMode}
                                />
                                <ErrorMessage
                                  name={`experience[${index}].duration`}
                                  component="div"
                                  className="text-red-500 text-sm"
                                />
                              </div>
                              {values.experience.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {readonlyMode ? (
                          <></>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              push({ company: "", position: "", duration: "" })
                            }
                            className="text-blue-500 text-sm mt-1 hover:underline"
                          >
                            + Add Experience
                          </button>
                        )}
                      </div>
                    )}
                  </FieldArray>

                  <div>
                    <label htmlFor="skills" className="block font-medium mb-1">
                      Github Link:
                    </label>
                    <Field
                      name="githubLink"
                      placeholder="GitHub Link"
                      className="w-full p-2 border rounded"
                      disabled={readonlyMode}
                    />
                    <ErrorMessage
                      name="githubLink"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="skills" className="block font-medium mb-1">
                      Linkedin Link:
                    </label>
                    <Field
                      name="linkedInLink"
                      placeholder="LinkedIn Link"
                      className="w-full p-2 border rounded"
                      disabled={readonlyMode}
                    />
                    <ErrorMessage
                      name="linkedInLink"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {readonlyMode ? (
                    <></>
                  ) : (
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      {isSaved ? "Edit Profile" : "Save Profile"}
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </Tabs.Content>
        <Tabs.Content value="posts">
          <Dashboard
            from="postsView"
            deleteButton={!readonlyMode}
            userId={userId}
          />
        </Tabs.Content>
      </Tabs.Root>
      {deleteProfileModalOpen  && (
        <DeleteProfileModalOpen
          showModal={deleteProfileModalOpen}
          setShowModal={setDeleteProfileModalOpen}
        />
      )}
    </div>
    </>
  );
}

export default Profile;
