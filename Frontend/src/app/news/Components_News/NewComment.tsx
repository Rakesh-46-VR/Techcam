import React, { useState, ChangeEvent, FormEvent } from "react";

interface NewCommentProps {
  currentUser: string;
  handleSubmit: (text: string) => void;
  placeholder?: string;
  initialText?: string;
  isEdit?: boolean;
  buttonText: string;
}

const NewComment: React.FC<NewCommentProps> = ({
  currentUser,
  handleSubmit,
  placeholder = "Add comment...",
  initialText = "",
  isEdit = false,
  buttonText
}) => {
  const [text, setText] = useState<string>(initialText);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(text);
    setText("");
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <form
      className={isEdit ? "edit-comment" : "new-comment-container"}
      onSubmit={onSubmit}
    >
      <p className="current_username">{currentUser}</p>
      <textarea
        className="new-comment"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
      />
      <button className="submit" type="submit">
        {buttonText}
      </button>
    </form>
  );
};

export default NewComment;
