import React from 'react'

const ProfileCard = ({ summary }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">{summary.videoId}</h3>
        <p className="text-gray-600">{summary.summary.body}</p>
        <div className="flex justify-between items-center mt-4">
            <p className="text-gray-500 text-sm">Created at: {summary.createdAt}</p>
            <p className="text-gray-500 text-sm">Updated at: {summary.updatedAt}</p>
        </div>
    </div>
  )
}

export default ProfileCard