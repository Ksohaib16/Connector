import "./AddFriend.css";

export const AddFriendModal = ({
  name,
  email,
  avatarUrl,
  handleAdd,
}: {
  name: string;
  email: string;
  avatarUrl: string;
  handleAdd: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="add-friend-modal">
      <div className="friend-img">
        <img src={avatarUrl} alt="" />
      </div>
      <div className="friend-info-container">
        <div className="friend-info">
          <div className="friend-name">{name}</div>
          <div className="friend-email">{email}</div>
        </div>
        <button
          className="add-friend-btn"
          onClick={handleAdd}
        >
          ADD
        </button>
      </div>
    </div>
  );
};
