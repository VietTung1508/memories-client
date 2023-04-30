import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import "./loading.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Loading(props) {
  const isUpload = props.isUpload;
  const isDelete = props.isDelete;
  const isUpdated = props.isUpdated;
  const noMsg = props.noMsg;
  return (
    <div className="loading">
      <div className="loading__message">
        <FontAwesomeIcon icon={faCircleNotch} className="spinner" />
        {!noMsg && <h1>
          Please wait for{" "}
          {isUpload || isDelete ? "post" : isUpdated ? "profile" : "website"} to{" "}
          {isDelete ? "delete" : isUpdated ? "update" : "load"}....
        </h1>}
      </div>
    </div>
  );
}

export default Loading;
