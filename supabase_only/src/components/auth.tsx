

const Auth = () => {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>Sign In</h2>
      <form>
        <input
          type="email"
          placeholder="Email"
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
        >
          Sign In
        </button>
      </form>
      <button style={{ marginTop: "0.5rem" }}>
        Switch to Sign Up
      </button>
    </div>
  )
}

export default Auth
