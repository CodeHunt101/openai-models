import { FormEvent, useState } from 'react';
import Form from '@/components/form';
import TextResult from '@/components/textResult';
import { submitRequest } from '@/utils/api';

export default function VisualAnalysis() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  

  const onChange = (event: any) => {
    console.log(event.target.files[0])
    setSelectedFile(event.target.files[0]);
  };

  async function onSubmit(event: any) {
    event.preventDefault();
    console.log(event)
    setLoading(true);
    if (!selectedFile) {
      // Handle case where no file is selected
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('/api/visual-analysis', {
        method: 'POST',
        body: formData,
      });

      console.log({response})

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result);
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <h1>VISUAL ANALYSIS</h1>
      <form method="post" onSubmit={onSubmit} className="form-control w-full max-w-lg" encType="multipart/form-data">
      <label className="label">
        <span className="label-text">Enter your prompt</span>
      </label>
        <input
          type="file"
          name="image"
          className="file-input file-input-bordered w-full max-w-xs"
          onChange={onChange}
        />
      <label className="label"></label>
      <div className="flex justify-center">
        <button className="btn btn-primary" disabled={loading}>
          Generate response
        </button>
      </div>
    </form>
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {result && <TextResult result={result} />}
    </div>
  );
}
