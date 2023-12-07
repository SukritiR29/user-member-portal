"use client"
import { useState, useEffect } from 'react';
import { Table, Thead, Th, Tbody, Tr, Checkbox, Td, Box, Button, Flex  } from '@chakra-ui/react'
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { GrFormPrevious } from "react-icons/gr";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight  } from "react-icons/md";




const apiUrl = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
const usersPerPage = 10;

const IndexPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [editedRows, setEditedRows] = useState([]);


  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('Fetched data:', data);

        if (Array.isArray(data) && data.length > 0) {
          // Filter users based on the search field
          const filteredUsers = data.filter(user =>
            Object.values(user).some(value =>
              value.toString().toLowerCase().includes(searchField.toLowerCase())
            )
          );

          const startIndex = (currentPage - 1) * usersPerPage;
          const endIndex = startIndex + usersPerPage;
          const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

          setUsers(paginatedUsers);
          setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
        } else {
          console.error('Invalid data structure:', data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentPage, searchField, apiUrl, usersPerPage]);

  const handleCheckboxChange = (userId) => {
    // Toggle the selection state of the clicked user ID
    setSelectedUserIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(userId)) {
        // User is already selected, remove from the list
        return prevSelectedIds.filter((id) => id !== userId);
      } else {
        // User is not selected, add to the list
        return [...prevSelectedIds, userId];
      }
    });
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    setSelectedUserIds(selectAll ? [] : users.map((user) => user.id));
  };

  const handleSearchChange = (event) => {
    setSearchField(event.target.value);
    setCurrentPage(1); // Reset current page when search field changes
  };

  const handleEdit = (userId) => {
    if (!editedRows.includes(userId)) {
      setEditedRows([...editedRows, userId]);
    }
  };

  const handleSave = (userId) => {
    setEditedRows(editedRows.filter((id) => id !== userId));
  };

  const handleCancel = (userId) => {
    setEditedRows((prevEditedRows) => prevEditedRows.filter((id) => id !== userId));
  };

  const handleDelete = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setSelectedUserIds((prevSelectedIds) => prevSelectedIds.filter((id) => id !== userId));
    setEditedRows((prevEditedRows) => prevEditedRows.filter((id) => id !== userId));
  };

  const handleDeleteSelected = () => {
    // Implement deletion logic for all selected rows
    const remainingUsers = users.filter((user) => !selectedUserIds.includes(user.id));
    setUsers(remainingUsers);
    setSelectedUserIds([]);
    setEditedRows([]);
  };

  console.log('Rendered with users:', users);

  return (
    <div className='bg-slate-100 h-screen'>
      <div className='p-10 pl-20 pr-20 text-stone-900 '>
      <Box p={4} className='border border-gray-300 rounded-lg mb-3'>
      <div className='flex justify-between items-center'>
      <input
        type="text"
        placeholder="Search..."
        value={searchField}
          onChange={handleSearchChange}
        mb={4}
        className='mb-5 text-black input input-bordered p-2 rounded-lg border-gray-300 m-2	shadow-md input-secondary w-full max-w-xs bg-slate-200'
      />
      <MdDelete className='text-red-600 text-3xl mr-10 align-end' onClick={handleDeleteSelected}/>
      </div>
      
      <Table variant="striped" colorScheme="teal" className='table-auto mb-3' >
        <Thead className='border-b border-gray-300 '>
          <Tr>
            <Th className="form-control pr-10 pl-5">
            <input
            className="cursor-pointer label checkbox checkbox-info ml-5"
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAllChange}
            />
            </Th>
            <Th className='py-3 pr-20 pl-10'>ID</Th>
            <Th className=' py=3 pr-20 pl-20'>Name</Th>
            <Th className='py-3 pr-20 pl-20'>Email</Th>
            <Th className='py-3 pr-20 pl-20'>Role</Th>
            <Th className='py-3 pl-20 '>Action</Th>
          </Tr>
        </Thead>
  <Tbody>
    {users && users.length > 0 ? (
      users.map((user) => (
        <Tr key={user.id} className={selectedUserIds.includes(user.id) ? 'bg-gray-200' : ''}>
        <Td className='pl-10'>
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </Td>
              <Td className='pl-10 pt-2'>
                      {editedRows.includes(user.id) ? (
                        <input
                          type="text"
                          className='w-[30px] text-center p-1 rounded-md'
                          value={user.id}
                          onChange={(e) => setUsers((prevUsers) => (
                            prevUsers.map((prevUser) => (
                              prevUser.id === user.id ? { ...prevUser, id: e.target.value } : prevUser
                            ))
                          ))}
                        />
                      ) : (
                        user.id
                      )}
                    </Td>
                    <Td className='pl-20 py-2 pt-2 ml-20'>
                      {editedRows.includes(user.id) ? (
                        <input
                          type="text"
                          className='w-[150px] p-1 rounded-md'
                          value={user.name}
                          onChange={(e) => setUsers((prevUsers) => (
                            prevUsers.map((prevUser) => (
                              prevUser.id === user.id ? { ...prevUser, name: e.target.value } : prevUser
                            ))
                          ))}
                          

                        />
                      ) : (
                        user.name
                      )}
                    </Td>
                    <Td className='pl-20 pr-10 py-2 pt-2'>
                      {editedRows.includes(user.id) ? (
                        <input
                          type="text"
                          className='w-[200px] p-1 rounded-md'
                          value={user.email}
                          onChange={(e) => setUsers((prevUsers) => (
                            prevUsers.map((prevUser) => (
                              prevUser.id === user.id ? { ...prevUser, email: e.target.value } : prevUser
                            ))
                          ))}
                        />
                      ) : (
                        user.email
                      )}
                    </Td>
                    <Td className='pl-20 pr-10 py-2 pt-2'>
                      {editedRows.includes(user.id) ? (
                        <input
                          type="text"
                          className='w-[80px] p-1 text-center rounded-md'
                          value={user.role}
                          onChange={(e) => setUsers((prevUsers) => (
                            prevUsers.map((prevUser) => (
                              prevUser.id === user.id ? { ...prevUser, role: e.target.value } : prevUser
                            ))
                          ))}
                        />
                      ) : (
                        user.role
                      )}
                    </Td>
                    <Td className='pl-20 py-2 flex pt-2'>
                      {editedRows.includes(user.id) ? (
                        <>
                          <Button colorScheme="teal" size="sm" onClick={() => handleSave(user.id)} className='btn bg-lime-500 p-1 pr-2 pl-2 text-slate-100 rounded-l-md' >
                            Save
                          </Button>
                          <Button colorScheme="gray" size="sm" onClick={() => handleCancel(user.id)} className='btn border border-slate-400 p-1 text-sm rounded-md'>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <div className='flex gap-2'>
                          <CiEdit
                            className='text-lg cursor-pointer'
                            onClick={() => handleEdit(user.id)}
                          />
                          <MdDelete
                            className='text-red-600 text-lg cursor-pointer'
                            onClick={() => handleDelete(user.id)}
                          />
                        </div>
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
      <Tr>
        <Td colSpan={3} textAlign="center">
          No users found
        </Td>
      </Tr>
    )}
  </Tbody>
</Table>
    
      </Box>
      <div className="join gap-5">
        <div className='flex justify-between'>
          <div className='mt-1 text-sm'>
          <h2>{selectedUserIds.length} of 46 rows selected</h2>
          </div>
        <Flex justify="end" >
        <div className='flex justisfy-end'>
        <h2 className='mt-2 text-sm mr-10'>Page {currentPage} of {totalPages}</h2>
            <Button mx={1} colorScheme="teal" onClick={() => setCurrentPage(1)} className='btn border border-slate-300 pl-1 pr-1'>
            <MdKeyboardDoubleArrowLeft />
            </Button>
            <Button mx={1} colorScheme="teal" onClick={() => setCurrentPage(currentPage - 1)} className='btn border border-slate-300 pl-1 pr-1'>
            <GrFormPrevious />
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                mx={1}
                colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
                onClick={() => setCurrentPage(index + 1)}
                className='btn border border-slate-300 pl-4 pr-4 p-2 text-sm'
              >
                {index + 1}
              </Button>
            ))}
            <Button mx={1} colorScheme="teal" onClick={() => setCurrentPage(currentPage + 1)} className='btn border border-slate-300 pl-1 pr-1'>
           <MdOutlineNavigateNext />
            </Button>
            <Button mx={1} colorScheme="teal" onClick={() => setCurrentPage(totalPages)} className='btn border border-slate-300 pl-1 pr-1'>
            <MdKeyboardDoubleArrowRight />
            </Button>
        </div>
          </Flex>
        </div>
</div>
      </div>
      
    </div>
  );
};

export default IndexPage;
