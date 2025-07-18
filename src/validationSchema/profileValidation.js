import * as Yup from 'yup';

export const profileSchema = Yup.object().shape({
  userName: Yup.string().required("Name is required"),
  skills: Yup.string().required("Skills are required"),
  bio: Yup.string().required("Bio is required"),
  githubLink: Yup.string().required("Enter a valid GitHub URL"),
  linkedInLink: Yup.string().required("Enter a valid LinkedIn URL"),
  experience: Yup.array().of(
    Yup.object().shape({
      company: Yup.string().required("Company name is required"),
      position: Yup.string().required("Position is required"),
      duration: Yup.string().required("Duration is required"),
    })
  ),
});
