import type { OnlineUsersProps} from "../types/app.type";


function OnlineUsers({ users }: OnlineUsersProps) {
  return (
    <aside className="users-panel">

      <h2>Online Users</h2>

      <div className="users-list">

        {users.map((user) => (
          <div
            className="user"
            key={user.userId}
          >
            <span className="status-dot"></span>

            <span>
              {user.username}
            </span>
          </div>
        ))}

      </div>

    </aside>
  );
}

export default OnlineUsers;