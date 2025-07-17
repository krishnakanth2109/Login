  import { useQuery, gql } from '@apollo/client';

    const PROTECTED_QUERY = gql`
      query GetProtectedData {
        protectedData
      }
    `;

    const ProtectedContent = () => {
      const { data, loading, error } = useQuery(PROTECTED_QUERY);

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;

      return (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-bold">Protected Data</h2>
          <p>{data?.protectedData}</p>
        </div>
      );
    };

    export default ProtectedContent;