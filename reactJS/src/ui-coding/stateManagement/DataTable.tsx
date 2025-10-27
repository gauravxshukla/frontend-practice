import React,{ useState } from 'react';
import users from '../../data/users';

// export default function DataTable() {
//   const [message, setMessage] = useState('Data Table');

//   return (
//     <div>
//       <h1>{message}</h1>
//       <table>
//         <thead>
//           <tr>
//             {[
//               { label: 'ID', key: 'id' },
//               { label: 'Name', key: 'name' },
//               { label: 'Age', key: 'age' },
//               { label: 'Occupation', key: 'occupation' },
//             ].map(({ label, key }) => (
//               <th key={key}>{label}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {users.map(({ id, name, age, occupation }) => (
//             <tr key={id}>
//               <td>{id}</td>
//               <td>{name}</td>
//               <td>{age}</td>
//               <td>{occupation}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

/* 
    Requirements
    Table requirements
    The users data table should display the following columns: Id, Name, Age, Occupation
    Each row in the table represents a single user
    Pagination requirements
    The pagination controls should allow the user to navigate to previous and next pages
    The pagination controls should display the current page number and the total number of pages
    The table should update dynamically when the user navigates to a different page
    Provide an option to select the number of users displayed per page (e.g., 5, 10, 20)

   Data Table Component - 
      user (useState with users json as initilisation)
      pageSize ( useState with initial size as 5)
      pageNo ( useState with initial value as 1 )

      function Paginate(usersList, pageNo, pageSize){
        return a new List
      }
         

      Table List Component - 
      usersList (via Props)

      Pagination Controls Component - 
      Prev and Next button
      Current page number
      pageSize should be selectable ( Ex - 5, 10, 20 )
*/

export default function DataTable() {
  return ('Data Table');
}
