import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { StyledTask } from "@/components/Task/style";
import { clx } from "@/utils/clx";
import useSound from "use-sound";
import { RxDotsHorizontal } from "react-icons/rx";
import { taskStatus } from "@/enum";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setEditableId, setImportant, updateTask } from "@/redux/tasks/action";
import { useSelector } from "react-redux";
import { editableId } from "@/redux/tasks/selectors";
import Tooltip from "@/components/Tooltip";

const ActionModal = dynamic(() => import("@/components/Modals/ActionModal"), { ssr: false });
const Checkbox = dynamic(() => import("@/components/Checkbox"), { ssr: false });

type TaskProps = {
  id: string;
  task_name: string;
  status: number;
  is_important: boolean;
};

const Task: React.FC<TaskProps> = ({ id, task_name, status, is_important }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [hoveredTaskId, setHoveredTaskId] = useState("");
  const [isImportant, setIsImportant] = useState(is_important);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef(null);

  const editId = useSelector(editableId);
  const dispatch = useDispatch();
  const showModal = hoveredTaskId === id;

  useEffect(() => {
    if (isEditable) {
      inputRef.current?.focus();
    }
  }, [isEditable]);

  useEffect(() => {
    if (editId === id) {
      setIsEditable(true);
      setEditValue(task_name);
    }
  }, [editId]);

  const handleDocumentClick = (event: any) => {
    if (modalRef.current && !modalRef.current?.contains(event.target)) {
      setHoveredTaskId("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleImportant = (taskId: string) => {
    const payload = {
      id: taskId,
      status,
      task_name,
      is_important: !is_important,
    };
    dispatch(setImportant(payload));
    setIsImportant(!isImportant);
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    setEditValue(e.target.value);
  };

  const handleSubmit = () => {
    if (editValue.trim() !== "") {
      const payload = {
        id: editId,
        task_name: editValue,
        status,
        is_important,
      };
      dispatch(updateTask(payload));
      dispatch(setEditableId(""));
      setEditValue("");
      setIsEditable(false);
    }
  };

  const handleOnKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setIsEditable(false);
      handleSubmit();
    }
  };

  console.log("isEditable", isEditable);

  return (
    <>
      <StyledTask>
        <div className="task-label">
          <Checkbox taskId={id} />
          {isEditable ? (
            <div className="edit-field">
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => {
                  handleChange(e);
                }}
                onBlur={() => {
                  setIsEditable(false);
                }}
                onKeyDown={(e) => {
                  handleOnKeyDown(e);
                }}
                size={100}
              />
            </div>
          ) : (
            <li className={clx(taskStatus[status] === "COMPLETED" && "strike")}>{task_name}</li>
          )}
        </div>
        <div className="task-action">
          {isImportant ? (
            <Tooltip content="Remove importance">
              <AiFillStar size={20} fill="gold" onClick={() => handleImportant(id)} />
            </Tooltip>
          ) : (
            <Tooltip content="Mark as important">
              <AiOutlineStar size={20} fill="gold" onClick={() => handleImportant(id)} />
            </Tooltip>
          )}
          <RxDotsHorizontal
            size={20}
            onMouseEnter={() => setHoveredTaskId(id)}
            onMouseLeave={() => setHoveredTaskId("")}
          />
        </div>
        {showModal && (
          <div
            ref={modalRef}
            className="action-modal"
            onMouseEnter={() => setHoveredTaskId(id)}
            onMouseLeave={() => setHoveredTaskId("")}>
            <ActionModal isOpen={showModal} taskId={id} />
          </div>
        )}
      </StyledTask>
    </>
  );
};

export default Task;
