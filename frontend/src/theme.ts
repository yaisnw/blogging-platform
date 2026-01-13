const saved: string = localStorage.getItem("theme") || "dark";
if (saved === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
export {};