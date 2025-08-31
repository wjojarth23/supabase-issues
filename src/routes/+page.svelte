<script lang="ts">
import { supabase } from '$lib/supabase';
import { user, userProfile, type UserProfile } from '$lib/userStore';

let pass: string = '';
let email: string = '';

async function fetchUserProfile(userId: string) {
    console.log("Fetching user profile for userId:", userId);
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
console.log("Fetched user profile data:", data, "Error:", error);
  if (data) {
    data.permissions = Array.isArray(data.permissions)
      ? data.permissions
      : typeof data.permissions === 'string'
        ? JSON.parse(data.permissions.replace(/([A-Z_]+)/g, '"$1"').replace(/\"/g, '"'))
        : [];
    data.banned = data.banned === true || data.banned === 'true';
    userProfile.set(data as UserProfile);
  } else {
    userProfile.set(null);
  }
}

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: pass,
  });
  if (data?.user) {
    user.set(data.user);
    await fetchUserProfile(data.user.id);
  } else if (error) {
    alert(error.message);
  }
}


supabase.auth.getUser().then(async ({ data }) => {
  if (data?.user) {
    user.set(data.user);
    await fetchUserProfile(data.user.id);
  }
});

supabase.auth.onAuthStateChange(async (_event, session) => {
  user.set(session?.user || null);
  if (session?.user) {
    await fetchUserProfile(session.user.id);
  } else {
    userProfile.set(null);
  }
});
</script>
{#if !$user}
  <div class="login-form">
    <h1>Login</h1>
    <input type="email" placeholder="Type your email..." bind:value={email} />
    <input type="password" placeholder="Enter your password" bind:value={pass} />
    <button on:click={signInWithEmail}>Submit</button>
  </div>
{:else}
  <div class="data-view">
    <h2>Welcome, {$user.email}!</h2>
    <p>You are now logged in.</p>
    {#if $userProfile}
      <div class="profile">
        <p><b>Full Name:</b> {$userProfile.full_name}</p>
        <p><b>Role:</b> {$userProfile.role}</p>
        <p><b>Banned:</b> {$userProfile.banned ? 'Yes' : 'No'}</p>
        <p><b>Permissions:</b> {Array.isArray($userProfile.permissions) ? $userProfile.permissions.join(', ') : $userProfile.permissions}</p>
      </div>
    {:else}
      <p>Loading profile...</p>
    {/if}
    <a href="/dashboard">Dashboard</a>
    <button on:click={() => { supabase.auth.signOut(); }}>Logout</button>
  </div>
{/if}
<style>
    .login-form input{
        height: 2rem;
        border-radius: 6px;
        border:1px solid black;
    }
    .login-form{
        display: flex;
    flex-direction: column; /* stack vertically */
    align-items: center;    /* horizontal alignment (centered here) */
    justify-content: center; /* vertical spacing (centered here) */   
    gap: 1rem;
    }
    .login-form button{
        height: 2rem;
        border-radius: 6px;
        border:1px solid black;
        background-color: rgb(255, 255, 255);
        color: black;
    }
</style>