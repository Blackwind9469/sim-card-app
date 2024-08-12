import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User } from "@prisma/client";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    phone: yup.string().required("Phone is required"),
    deleted: yup.boolean().required("Deleted status is required"),
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      deleted: false,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingUser) {
      setValue("name", editingUser.name);
      setValue("phone", editingUser.phone);
      setValue("deleted", editingUser.deleted);
    }
  }, [editingUser, setValue]);

  const fetchUsers = async () => {
    const response = await fetch(`/api/users?page=${page}&limit=10`);
    const data = await response.json();
    setUsers(data.users);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const onSubmit = async (data: any) => {
    if (editingUser) {
      await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    reset();
    setEditingUser(null);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Users</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='mb-8'>
        <div className='mb-4'>
          <label className='block mb-2'>Name</label>
          <input {...register("name")} className='border p-2' />
          {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Phone</label>
          <input {...register("phone")} className='border p-2' />
          {errors.phone && (
            <p className='text-red-500'>{errors.phone.message}</p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block mb-2'>Deleted</label>
          <div>
            <label className='inline-flex items-center mr-4'>
              <input
                type='radio'
                {...register("deleted")}
                value='false'
                className='form-radio'
              />
              <span className='ml-2'>False</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                {...register("deleted")}
                value='true'
                className='form-radio'
              />
              <span className='ml-2'>True</span>
            </label>
          </div>
          {errors.deleted && (
            <p className='text-red-500'>{errors.deleted.message}</p>
          )}
        </div>
        <button type='submit' className='bg-blue-500 text-white p-2'>
          {editingUser ? "Update" : "Submit"}
        </button>
        {editingUser && (
          <button
            type='button'
            onClick={() => setEditingUser(null)}
            className='bg-gray-500 text-white p-2 ml-2'
          >
            Cancel
          </button>
        )}
      </form>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border p-2 text-left'>Name</th>
            <th className='border p-2 text-left'>Phone</th>
            <th className='border p-2 text-left'>Deleted</th>
            <th className='border p-2 text-left'>Created At</th>
            <th className='border p-2 text-left'>Updated At</th>
            <th className='border p-2 text-left'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.deleted ? "Yes" : "No"}</td>
              <td>{new Date(user.created_at).toLocaleString()}</td>
              <td>{new Date(user.updated_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleEdit(user)}
                  className='bg-yellow-500 text-white p-1 mr-2'
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className='bg-red-500 text-white p-1'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-4 flex justify-center'>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className='bg-blue-500 text-white p-2 mr-2'
        >
          Previous
        </button>
        <span className='p-2'>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className='bg-blue-500 text-white p-2 ml-2'
        >
          Next
        </button>
      </div>
    </div>
  );
}
