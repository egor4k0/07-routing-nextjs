
import { Form, Formik, Field, type FormikHelpers, ErrorMessage } from "formik";
import css from "./NoteForm.module.css"
import { useId } from "react";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { NewNote } from "../../types/note";

interface NoteFormProps {
  onClose: () => void;
}

interface OrderFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const initialValues: OrderFormValues = {
  title: "",
  content: "",
  tag: "Todo",
}

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content is too long"),
  tag: Yup.string()
    .oneOf(["Todo" , "Work" , "Personal" , "Meeting" , "Shopping"], "Invalid tag")
    .required("Choose note's tag")
})



export default function NoteForm({onClose}:NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationFn: (note:NewNote) => createNote(note),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose()
    }
  })

  const handleSubmit = (
    values: OrderFormValues,
    actions: FormikHelpers<OrderFormValues>,
  ) => {
    createNoteMutation.mutate(values);
    actions.resetForm();
  }

  

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={OrderFormSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
          <ErrorMessage name="title" className={css.error} component="span"/>
        </div>
  
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" className={css.error} component="span"/>
        </div>
  
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field id={`${fieldId}-tag`} name="tag" className={css.select} as="select">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" className={css.error} component="span"/>
        </div>
  
        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={false}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  )
}
