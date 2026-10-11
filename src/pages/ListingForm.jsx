import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

const empty = { title: "", description: "", price: "", country: "", location: "" };
const inputCls = "w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-rose-500 focus:bg-white";

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api(`/listings/${id}`)
      .then((l) => {
        setForm({
          title: l.title, description: l.description || "", price: l.price,
          country: l.country, location: l.location,
        });
        setPreview(l.image?.url || "");
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isEdit && !file) return setError("Please upload an image");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(`listing[${k}]`, v));
    if (file) fd.append("listing[image]", file);

    setSaving(true);
    try {
      const saved = await api(isEdit ? `/listings/${id}` : "/listings", {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      navigate(`/listings/${saved._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="bg-neutral-800 p-6 text-center text-white">
        <h1 className="text-2xl font-bold">{isEdit ? "Edit your listing" : "List your property"}</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 p-6 sm:p-8">
        {error && <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        <div>
          <label className="mb-1 block font-semibold">Title</label>
          <input name="title" value={form.title} onChange={onChange} required className={inputCls} />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} required rows={4} className={inputCls} />
        </div>

        <div>
          <label className="mb-1 block font-semibold">Photo</label>
          {preview && <img src={preview} alt="Preview" className="mb-3 max-h-56 rounded-xl object-cover" />}
          <input type="file" accept="image/*" onChange={onFile} className="block w-full text-sm" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold">Price per night (₹)</label>
            <input type="number" min="0" name="price" value={form.price} onChange={onChange} required className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block font-semibold">Country</label>
            <input name="country" value={form.country} onChange={onChange} required className={inputCls} />
          </div>
        </div>

        <div>
          <label className="mb-1 block font-semibold">Location</label>
          <input name="location" value={form.location} onChange={onChange} required className={inputCls} />
        </div>

        <div className="flex justify-end gap-3 border-t pt-5">
          <Link to={isEdit ? `/listings/${id}` : "/"} className="rounded-xl border-2 px-5 py-2.5 font-semibold text-gray-600">
            Cancel
          </Link>
          <button disabled={saving} className="rounded-xl bg-rose-500 px-6 py-2.5 font-semibold text-white disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Update Listing" : "Create Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}