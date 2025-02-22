import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api'

interface ProcurementRequest {
  id: number;
  title: string;
  description: string;
  departmentId: number;
  priorityLevel: 'Low' | 'Medium' | 'High';
  deadlineDate: string;
  quantity:number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned' | 'Completed';
}

const Procurement: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priorityLevel, setPriorityLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/procurement');
      setRequests(response.data.requests);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch procurement requests.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !deadlineDate) {
      toast.error('Please fill out all fields.');
      return;
    }

    try {
      await api.post('/api/procurement', {
        title,
        description,
        departmentId: user?.id,
        priorityLevel,
        deadlineDate,
        quantity,
      });

      toast.success('Procurement request submitted!');
      fetchRequests();
      setTitle('');
      setDescription('');
      setPriorityLevel('Medium');
      setDeadlineDate('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit procurement request.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Procurement Requests</h1>

      {/* New Procurement Request Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="title" className="block text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter request title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter request description"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-gray-700">Quantity</label>
          <input 
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full p-2 border rouded-lg"
          placeholder="Enter request quantity"
          min={1}
           />
        </div>

        <div>
          <label htmlFor="priorityLevel" className="block text-gray-700">Priority Level</label>
          <select
            id="priorityLevel"
            value={priorityLevel}
            onChange={(e) => setPriorityLevel(e.target.value as any)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="deadlineDate" className="block text-gray-700">Deadline Date</label>
          <input
            type="date"
            id="deadlineDate"
            value={deadlineDate}
            onChange={(e) => setDeadlineDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit Request
        </button>
      </form>

      {/* Existing Requests */}
      <h2 className="text-xl font-semibold mb-4">Existing Requests</h2>
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className="p-4 bg-gray-100 rounded-lg shadow">
              <h3 className="font-bold text-lg">{request.title}</h3>
              <p className="text-gray-700">{request.description}</p>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">Priority: {request.priorityLevel}</span>
                <span className="text-sm text-gray-500">Status: {request.status}</span>
              </div>
              <span className="text-sm text-gray-500">Deadline: {new Date(request.deadlineDate).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No procurement requests found.</p>
        )}
      </div>
    </div>
  );
};

export default Procurement;
