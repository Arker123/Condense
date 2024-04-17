import React from 'react'

const ProfileCardNote = ({ note }) => {
    const getVideoUrl = (videoId) => {
        return `https://www.youtube.com/watch?v=${videoId}`;
        };
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2">{getVideoUrl(note.videoId)}</h3>
        <p className="text-gray-600">{note.body}</p>
    </div>
  )
}

export default ProfileCardNote