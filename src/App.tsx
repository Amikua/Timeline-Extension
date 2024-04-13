import { createSignal, createEffect, For, Accessor, Setter } from "solid-js";
import toast, { Toaster } from "solid-toast";

// const url = import.meta.env.PROD ? "https://timeline-amikua.vercel.app/api/events" : "http://localhost:3000/api/events";
const url = "https://timeline-amikua.vercel.app/api/events";

function StyledInput(props: {
  value: Accessor<string>;
  onChange: Setter<string>;
  placeholder?: string;
}) {
  return (
    <>
      <label class="block text-sm font-thin">{props.placeholder}</label>
      <input
        class="my-2 w-full rounded border border-stone-700 bg-stone-800 p-2 text-stone-100"
        value={props.value()}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
      />
    </>
  );
}

function Loader() {
  return (
    <svg
      class="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7z"
      ></path>
    </svg>
  );
}

function App() {
  const [projectId, setProjectId] = createSignal(
    localStorage.getItem("projectId") || "",
  );
  const [apiKey, setApiKey] = createSignal(
    localStorage.getItem("apiKey") || "",
  );
  const [username, setUsername] = createSignal(
    localStorage.getItem("username") || "",
  );

  const [allCategories] = createSignal([
    { name: "SPEECH", emoji: "💬", label: "Chat" },
    { name: "ISSUE", emoji: "🔥", label: "Issue" },
    { name: "BUG", emoji: "🐛", label: "Bug" },
    { name: "FEATURES", emoji: "✨", label: "Features" },
    { name: "WIP", emoji: "🚧", label: "Work in Progress" },
    { name: "ZAP", emoji: "⚡️", label: "Performance" },
    { name: "TADA", emoji: "🎉", label: "Start" },
    { name: "AMBULANCE", emoji: "🚨", label: "Alarm" },
    { name: "ROCKET", emoji: "🚀", label: "Deployment" },
    { name: "CHECKMARK", emoji: "✅", label: "Completion" },
    { name: "LOCK", emoji: "🔒️", label: "Security" },
    { name: "PENCIL", emoji: "✏️", label: "Sketch" },
    { name: "REWIND", emoji: "⏪️", label: "Revert" },
    { name: "BULB", emoji: "💡", label: "Idea" },
    { name: "PHONE", emoji: "📱", label: "Mobile" },
    { name: "RUBBISH", emoji: "🗑️", label: "Rubbish" },
  ] as const);
  const [category, setCategory] = createSignal("");
  const [content, setContent] = createSignal("");

  const [isCreating, setIsCreating] = createSignal(false);

  createEffect(() => {
    localStorage.setItem("projectId", projectId());
  });

  createEffect(() => {
    localStorage.setItem("apiKey", apiKey());
  });

  createEffect(() => {
    localStorage.setItem("username", username());
  });

  const createEvent = async () => {
    setIsCreating(true);
    if (!projectId() || !apiKey() || !username() || !category() || !content()) {
      toast.error("Please fill all the fields");
      setIsCreating(false);
      return;
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: apiKey(),
        projectId: projectId(),
        username: username(),
        category: category(),
        content: content(),
      }),
    });
    console.log(response);

    if (response.status === 201) {
      toast.success("Event created");
      setContent("");
      setCategory("");
    } else {
      toast.error(`Error: ${response.status} ${response.statusText}`);
    }

    setIsCreating(false);
  };

  return (
    <main class="h-fit w-96 bg-stone-900 p-4 text-stone-100">
      <h1 class="my-2 text-lg font-thin">Timeline amikua</h1>
      <div>
        <StyledInput
          value={projectId}
          onChange={setProjectId}
          placeholder="Project ID"
        />
        <StyledInput
          value={apiKey}
          onChange={setApiKey}
          placeholder="API Key"
        />
        <StyledInput
          value={username}
          onChange={setUsername}
          placeholder="Username"
        />
      </div>
      <label class="block text-sm font-thin">Category</label>
      <select
        class="my-2 w-full rounded border border-stone-700 bg-stone-800 p-2 text-stone-100"
        value={category()}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="">Select a category</option>
        <For each={allCategories()}>
          {({ name, emoji, label }) => (
            <option value={name}>
              {emoji} {label}
            </option>
          )}
        </For>
      </select>

      <label class="block text-sm font-thin">Content</label>
      <textarea
        class="my-2 w-full rounded border border-stone-700 bg-stone-800 p-2 text-stone-100"
        onChange={(event) => setContent(event.target.value)}
        value={content()}
        placeholder="Event content"
      />
      <button
        class="my-2 flex w-full items-center justify-center rounded border border-stone-700 bg-stone-800 p-2 text-stone-100"
        onClick={createEvent}
      >
        {isCreating() ? <Loader /> : "Create Event"}
      </button>
      <Toaster
        toastOptions={{
          style: {
            // Set background to stone 800 and text to stone 100
            background: "#292524",
            color: "#D1D5DB",
          },
        }}
      />
    </main>
  );
}

export default App;
