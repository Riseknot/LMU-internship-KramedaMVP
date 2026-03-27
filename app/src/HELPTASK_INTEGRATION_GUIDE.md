/**
 * Integration guidelines for frontend helptasks API
 * 
 * 1. USE THE HOOK IN YOUR COMPONENT:
 * 
 * ```tsx
 * import { useHelptasks } from '@/hooks/useHelptasks';
 * 
 * export function MyHelptaskComponent() {
 *   const { helptasks, loading, error, fetchHelptasks, createHelptask, updateHelptask } = useHelptasks({
 *     autoFetch: true,
 *     filters: { status: 'open' }
 *   });
 * 
 *   return (
 *     <HelptaskListView 
 *       helptasks={helptasks}
 *       loading={loading}
 *       error={error}
 *     />
 *   );
 * }
 * ```
 * 
 * 2. CREATE A NEW HELPTASK:
 * 
 * ```tsx
 * const handleCreate = async () => {
 *   const payload = {
 *     taskType: 'Pflege',
 *     title: 'Morgenroutine',
 *     description: 'Unterstützung bei Körperpflege',
 *     location: { type: 'Point', coordinates: [13.405, 52.52] },
 *     address: { zipCode: '10115', city: 'Berlin' },
 *     startDate: '2026-03-28',
 *     startTime: '08:00',
 *     endDate: '2026-03-28',
 *     endTime: '10:00',
 *     firstname: 'Dennis',
 *     surname: 'Mustermann',
 *     email: 'dennis@example.com',
 *     createdBy: currentUserId,
 *   };
 *   
 *   await createHelptask(payload);
 * };
 * ```
 * 
 * 3. UPDATE A HELPTASK:
 * 
 * ```tsx
 * const handleUpdate = async (taskId: string) => {
 *   await updateHelptask(taskId, { status: 'assigned' });
 * };
 * ```
 * 
 * 4. FILTER HELPTASKS:
 * 
 * ```tsx
 * const { helptasks, fetchHelptasks } = useHelptasks();
 * 
 * // Search by firstname
 * await fetchHelptasks({ firstname: 'Dennis' });
 * 
 * // Filter by status
 * await fetchHelptasks({ status: 'open' });
 * 
 * // Combine filters
 * await fetchHelptasks({ firstname: 'Dennis', status: 'open', zipCode: '10115' });
 * ```
 * 
 * 5. COMPONENT IMPORTS:
 * 
 * ```tsx
 * import { HelptaskListView } from '@/components/HelptaskListView';
 * import { useHelptasks } from '@/hooks/useHelptasks';
 * import { helptaskService, type Helptask } from '@/services/helptaskService';
 * ```
 * 
 * AVAILABLE FILTER FIELDS:
 * - firstname: Search by helper/creator firstname
 * - surname: Search by helper/creator surname
 * - email: Search by helper/creator email
 * - status: Filter by status ('open' | 'assigned' | 'completed')
 * - zipCode: Filter by location postal code
 * - title: Search by task title
 * 
 * API ENDPOINTS:
 * - GET  /api/helptasks?firstname=Dennis        - Get all open helptasks for Dennis
 * - GET  /api/helptasks?status=open             - Get all open helptasks
 * - POST /api/helptasks                         - Create a new helptask
 * - PUT  /api/helptasks?id=TASK_ID              - Update a helptask
 * 
 * RESPONSE EXAMPLE:
 * ```json
 * {
 *   "_id": "507f1f77bcf86cd799439011",
 *   "taskType": "Pflege",
 *   "title": "Morgenroutine",
 *   "description": "Unterstützung bei Körperpflege",
 *   "location": {
 *     "type": "Point",
 *     "coordinates": [13.405, 52.52]
 *   },
 *   "address": {
 *     "zipCode": "10115",
 *     "city": "Berlin",
 *     "street": "Musterstr. 1"
 *   },
 *   "startDate": "2026-03-28T00:00:00.000Z",
 *   "startTime": "08:00",
 *   "endDate": "2026-03-28T00:00:00.000Z",
 *   "endTime": "10:00",
 *   "status": "open",
 *   "firstname": "Dennis",
 *   "surname": "Mustermann",
 *   "email": "dennis@example.com",
 *   "createdBy": "507f191e810c19729de860ea",
 *   "createdAt": "2026-03-27T10:30:00.000Z",
 *   "updatedAt": "2026-03-27T10:30:00.000Z"
 * }
 * ```
 */

export {};
