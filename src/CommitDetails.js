import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CommitDetails.css"; // Import custom CSS for styling

function CommitDetails() {
  const { owner, repository, commitSHA } = useParams();

  const [commit, setCommit] = useState(null);
  const [diff, setDiff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommitDetails = async () => {
      try {
        const commitDetailsResponse = await axios.get(
          `http://localhost:5000/repositories/${owner}/${repository}/commits/${commitSHA}`
        );
        const diffResponse = await axios.get(
          `http://localhost:5000/repositories/${owner}/${repository}/commits/${commitSHA}/diff`
        );

        setCommit(commitDetailsResponse.data);
        setDiff(diffResponse.data); // Assuming diffResponse.data is the detailed diff object
        setLoading(false);
      } catch (error) {
        console.error("Error fetching commit details:", error);
        setError("Failed to fetch commit details");
        setLoading(false);
      }
    };

    fetchCommitDetails();
  }, [owner, repository, commitSHA]);

  const toggleCollapse = (index) => {
    setDiff((prevDiff) => {
      const newFiles = [...prevDiff.files]; // Create a copy of the files array
      newFiles[index] = {
        ...newFiles[index],
        collapsed: !newFiles[index].collapsed, // Toggle the collapsed property
      };
      return {
        ...prevDiff,
        files: newFiles,
      };
    });
  };

  const isCollapsed = (index) => {
    return diff && diff.files[index].collapsed;
  };

  const renderFileDiffs = (files) => {
    return files.map((file, fileIndex) => (
      <div key={fileIndex} className="file-diff">
        <div className="file-header">
          <span className="file-path">{file.filename}</span>
          <button
            className="collapse-button"
            onClick={() => toggleCollapse(fileIndex)}
          >
            {isCollapsed(fileIndex) ? "Expand" : "Collapse"}
          </button>
        </div>
        <div
          className={`file-content ${
            isCollapsed(fileIndex) ? "collapsed" : ""
          }`}
        >
          {file.patch.split("\n").map((line, lineIndex) => {
            let lineNumber = null;
            const className = line.startsWith("+")
              ? "line-added"
              : line.startsWith("-")
              ? "line-removed"
              : "line-neutral";

            if (line.startsWith("@@")) {
              lineNumber = null;
            } else {
              lineNumber = lineIndex + 1;
            }

            return (
              <div key={lineIndex} className={className}>
                {lineNumber !== null && (
                  <span className="line-number">{lineNumber}</span>
                )}
                {line}
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className="commit-details-container">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {commit && (
        <div className="commit-header">
          <div className="commit-header-left">
            <img
              src={commit.author.avatar_url}
              alt={commit.author.login}
              className="author-avatar"
            />
            <div className="commit-details">
              <div className="commit-title">
                {commit.commit.message.split("\n")[0]}
              </div>
              <p className="commit-meta">
                Authored by <strong>{commit.commit.author.name}</strong>{" "}
                {new Date(commit.commit.author.date).toLocaleString()}
              </p>
              <p className="commit-body">
                {commit.commit.message.split("\n").slice(1).join("\n")}
              </p>
            </div>
          </div>
          <div className="commit-header-right">
            <p style={{ color: "#a2a6ad" }}>
              <strong>Committed by:</strong>{" "}
              <span style={{ color: "#6d727c" }}>
                {commit.commit.committer.name}
              </span>{" "}
            </p>
            <p style={{ color: "#a2a6ad" }}>
              <strong>Commit:</strong>{" "}
              <span style={{ color: "black" }}>{commit.sha}</span>
            </p>
            <p style={{ color: "#a2a6ad" }}>
              <strong>Parent:</strong>{" "}
              <span style={{ color: "#1c7cd6" }}>
                {commit.parents.map((parent) => parent.sha).join(", ")}
              </span>
            </p>
          </div>
        </div>
      )}
      <div className="diff-container">
        {diff && diff.files ? (
          renderFileDiffs(diff.files)
        ) : (
          <div>No diff available for this commit.</div>
        )}
      </div>
    </div>
  );
}

export default CommitDetails;
