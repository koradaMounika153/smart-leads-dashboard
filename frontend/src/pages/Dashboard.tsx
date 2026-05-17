import { useEffect, useState } from "react";

import { CSVLink } from "react-csv";

import api from "../services/api";

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  source: string;
}

function Dashboard() {
  const [leads, setLeads] = useState<
    Lead[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] =
    useState("");

  const [status, setStatus] =
    useState("New");

  const [source, setSource] =
    useState("Website");

  const [search, setSearch] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("");

  const [filterSource, setFilterSource] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        `/leads?page=${page}&search=${search}&status=${filterStatus}&source=${filterSource}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeads(response.data.leads);

      setTotalPages(
        response.data.totalPages
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await api.post(
        "/leads",
        {
          name,
          email,
          status,
          source,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      setEmail("");
      setStatus("New");
      setSource("Website");

      fetchLeads();
    } catch (error) {
      console.log(error);

      alert("Create Lead Failed");
    }
  };

  const handleDeleteLead = async (
    id: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await api.delete(`/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchLeads();
    } catch (error) {
      console.log(error);

      alert("Delete Lead Failed");
    }
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await api.put(
        `/leads/${id}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLeads();
    } catch (error) {
      console.log(error);

      alert("Update failed");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [
    page,
    search,
    filterStatus,
    filterSource,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Smart Leads Dashboard
        </h1>

        <div className="flex gap-3">
          <CSVLink
            data={leads}
            filename="leads.csv"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Export CSV
          </CSVLink>

          <button
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              window.location.href = "/";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CREATE LEAD BOX */}

      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Create Lead
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="New">
              New
            </option>

            <option value="Contacted">
              Contacted
            </option>

            <option value="Qualified">
              Qualified
            </option>

            <option value="Lost">
              Lost
            </option>
          </select>

          <select
            className="border p-2 rounded"
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
          >
            <option value="Website">
              Website
            </option>

            <option value="Instagram">
              Instagram
            </option>

            <option value="Referral">
              Referral
            </option>
          </select>
        </div>

        <button
          onClick={handleCreateLead}
          className="bg-black text-white px-4 py-2 rounded mt-4"
        >
          Create Lead
        </button>
      </div>

      {/* FILTERS BOX */}

      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border p-2 rounded"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="border p-2 rounded"
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value
              )
            }
          >
            <option value="">
              All Status
            </option>

            <option value="New">
              New
            </option>

            <option value="Contacted">
              Contacted
            </option>

            <option value="Qualified">
              Qualified
            </option>

            <option value="Lost">
              Lost
            </option>
          </select>

          <select
            className="border p-2 rounded"
            value={filterSource}
            onChange={(e) =>
              setFilterSource(
                e.target.value
              )
            }
          >
            <option value="">
              All Sources
            </option>

            <option value="Website">
              Website
            </option>

            <option value="Instagram">
              Instagram
            </option>

            <option value="Referral">
              Referral
            </option>
          </select>
        </div>
      </div>

      {/* LEADS TABLE */}

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold">
            Leads List
          </h2>
        </div>

        {loading ? (
          <p className="p-6 text-center">
            Loading...
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3 text-left">
                  Name
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Source
                </th>

                <th className="p-3 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b"
                >
                  <td className="p-3">
                    {lead.name}
                  </td>

                  <td className="p-3">
                    {lead.email}
                  </td>

                  <td className="p-3">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          lead._id,
                          e.target.value
                        )
                      }
                      className="border p-1 rounded"
                    >
                      <option value="New">
                        New
                      </option>

                      <option value="Contacted">
                        Contacted
                      </option>

                      <option value="Qualified">
                        Qualified
                      </option>

                      <option value="Lost">
                        Lost
                      </option>
                    </select>
                  </td>

                  <td className="p-3">
                    {lead.source}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleDeleteLead(
                          lead._id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading &&
          leads.length === 0 && (
            <p className="p-6 text-center">
              No Leads Found
            </p>
          )}
      </div>

      {/* PAGINATION */}

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
          className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Previous
        </button>

        <span className="flex items-center">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Dashboard;