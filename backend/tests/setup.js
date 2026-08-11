/**
 * Shared in-memory replacement for the pg pool used by src/config/db.
 *
 * We mock ../src/config/db so tests never touch a real database. The mock
 * implements just enough SQL behaviour for the queries the models issue,
 * keyed by parameter position (the models use positional $1..$n params).
 *
 * Tests interact with state via the exported helpers.
 */

const state = {
  users: [], // { id, name, email, password_hash, role, created_at }
  tasks: [], // { id, title, description, user_id, created_at }
  userSeq: 0,
  taskSeq: 0,
};

const resetState = () => {
  state.users = [];
  state.tasks = [];
  state.userSeq = 0;
  state.taskSeq = 0;
};

const now = () => new Date().toISOString();

const query = async (text, params = []) => {
  const sql = text.replace(/\s+/g, " ").trim();

  // ---- users ----
  if (sql.startsWith("INSERT INTO users")) {
    const [name, email, passwordHash, role] = params;
    const user = {
      id: ++state.userSeq,
      name,
      email,
      password_hash: passwordHash,
      role,
      created_at: now(),
    };
    state.users.push(user);
    // Model uses RETURNING id,name,email,role — mirror that projection.
    return {
      rows: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      ],
    };
  }

  if (sql.startsWith("SELECT * FROM users WHERE email=$1")) {
    const [email] = params;
    return { rows: state.users.filter((u) => u.email === email) };
  }

  // ---- tasks ----
  if (sql.startsWith("INSERT INTO tasks")) {
    const [title, description, userId] = params;
    const task = {
      id: ++state.taskSeq,
      title,
      description,
      user_id: userId,
      created_at: now(),
    };
    state.tasks.push(task);
    return { rows: [task] };
  }

  if (sql.startsWith("SELECT * FROM tasks WHERE user_id=$1")) {
    const [userId] = params;
    return { rows: state.tasks.filter((t) => t.user_id === userId) };
  }

  if (sql.startsWith("SELECT * FROM tasks WHERE id=$1 AND user_id=$2")) {
    const [id, userId] = params;
    return {
      rows: state.tasks.filter(
        (t) => t.id === Number(id) && t.user_id === Number(userId)
      ),
    };
  }

  if (sql.startsWith("UPDATE tasks SET title=$1,description=$2 WHERE id=$3 AND user_id=$4")) {
    const [title, description, id, userId] = params;
    const task = state.tasks.find(
      (t) => t.id === Number(id) && t.user_id === Number(userId)
    );
    if (!task) return { rows: [] };
    task.title = title;
    task.description = description;
    return { rows: [task] };
  }

  if (sql.startsWith("DELETE FROM tasks WHERE id=$1 AND user_id=$2")) {
    const [id, userId] = params;
    const task = state.tasks.find(
      (t) => t.id === Number(id) && t.user_id === Number(userId)
    );
    if (!task) return { rows: [] };
    state.tasks = state.tasks.filter((t) => t.id !== task.id);
    return { rows: [{ id: task.id }] };
  }

  throw new Error(`Unhandled SQL in test double: ${sql}`);
};

const pool = { query };

module.exports = { pool, state, resetState };
