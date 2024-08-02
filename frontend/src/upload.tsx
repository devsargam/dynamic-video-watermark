export function UploaderComponent() {
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Upload to server
    return;
  }

  return <form className="max-w-sm" onSubmit={handleSubmit}>
    <input type="file"
      className="w-full text-gray-500 font-medium text-lg bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
    />
    <button type="submit" className="
              px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-medium border border-current outline-none bg-gray-800 hover:bg-[#222] active:bg-[#333]
      ">Upload</button>
  </form>
}
