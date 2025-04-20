import { useEffect, useState } from "react";
import { useQartStore } from "../../store/qartStore";
import QartList from "../../components/posts/QartList";
import CreateQart from "../../components/posts/CreateQart";

const Feed = () => {
  const { fetchQarts, qarts, isLoading } = useQartStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchQarts();
  }, [fetchQarts]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          Create Qart
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : Array.isArray(qarts) ? (
        <QartList qarts={qarts} />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      {showCreateModal && (
        <CreateQart onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Feed;
