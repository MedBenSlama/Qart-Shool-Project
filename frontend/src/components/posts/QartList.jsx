import QartItem from "./QartItem";

const QartList = ({ qarts }) => {
  if (!Array.isArray(qarts) || qarts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No qarts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {qarts.map((qart) => qart && <QartItem key={qart._id} qart={qart} />)}
    </div>
  );
};

export default QartList;
