import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationImageService {

  private readonly fallbackImage =
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80';

  /*
   * ============================================================
   * INDIA + INTERNATIONAL DESTINATION IMAGES
   * ============================================================
   *
   * Keys are normalized automatically by getImageUrl().
   *
   * Example:
   * "Manali"
   * "Manali, Himachal Pradesh"
   * "Manali, India"
   *
   * will all resolve to the Manali image.
   */

  private readonly images: Record<string, string> = {

    // ==========================================================
    // NORTH INDIA
    // ==========================================================

    'delhi':
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',

    'new delhi':
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',

    'chandigarh':
      'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',

    'amritsar':
      'https://images.unsplash.com/photo-1588096291845-1f7f7c6c6c91?auto=format&fit=crop&w=1200&q=80',

    'jaipur':
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',

    'jodhpur':
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',

    'udaipur':
      'https://images.unsplash.com/photo-1602643163986-9c1f1f2f4c8e?auto=format&fit=crop&w=1200&q=80',

    'jaisalmer':
      'https://images.unsplash.com/photo-1473580044384-7ba9967f4b9c?auto=format&fit=crop&w=1200&q=80',

    'agra':
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',

    'lucknow':
      'https://images.unsplash.com/photo-1600554661622-8f2f4a9f4c3e?auto=format&fit=crop&w=1200&q=80',

    'kanpur':
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80',

    'varanasi':
      'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1200&q=80',

    'haridwar':
      'https://images.unsplash.com/photo-1590050752117-23a9d0e7b8e1?auto=format&fit=crop&w=1200&q=80',

    'rishikesh':
      'https://images.unsplash.com/photo-1590050752117-23a9d0e7b8e1?auto=format&fit=crop&w=1200&q=80',

    'dehradun':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'shimla':
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',

    'manali':
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',

    'dharamshala':
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',

    'kasol':
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',

    'mussoorie':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // JAMMU & KASHMIR / LADAKH
    // ==========================================================

    'jammu':
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',

    'jammu and kashmir':
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',

    'jammu kashmir':
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',

    'kashmir':
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',

    'srinagar':
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',

    'gulmarg':
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',

    'pahalgam':
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',

    'leh':
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',

    'ladakh':
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',

    'spiti':
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // EAST INDIA
    // ==========================================================

    'kolkata':
      'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',

    'calcutta':
      'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',

    'howrah':
      'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',

    'siliguri':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'darjeeling':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'kalimpong':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'gangtok':
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',

    'sikkim':
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',

    'bhubaneswar':
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',

    'puri':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'ranchi':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'patna':
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // SOUTH INDIA — KARNATAKA
    // ==========================================================

    'bengaluru':
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',

    'bangalore':
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',

    'mysore':
      'https://images.unsplash.com/photo-1600100397608-f010e7b7c9f4?auto=format&fit=crop&w=1200&q=80',

    'mysuru':
      'https://images.unsplash.com/photo-1600100397608-f010e7b7c9f4?auto=format&fit=crop&w=1200&q=80',

    'coorg':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'madikeri':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'hampi':
      'https://images.unsplash.com/photo-1600100397608-f010e7b7c9f4?auto=format&fit=crop&w=1200&q=80',

    'mangalore':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'udupi':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // SOUTH INDIA — TAMIL NADU
    // ==========================================================

    'chennai':
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',

    'coimbatore':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'madurai':
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',

    'ooty':
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',

    'kodaikanal':
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',

    'pondicherry':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'puducherry':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // SOUTH INDIA — KERALA
    // ==========================================================

    'kerala':
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',

    'kochi':
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',

    'cochin':
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',

    'thiruvananthapuram':
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',

    'trivandrum':
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',

    'alleppey':
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',

    'alappuzha':
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',

    'munnar':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'varkala':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'wayanad':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // SOUTH INDIA — ANDHRA PRADESH
    // ==========================================================

    'visakhapatnam':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'vizag':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'vijayawada':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'tirupati':
      'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // SOUTH INDIA — TELANGANA
    // ==========================================================

    'hyderabad':
      'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80',

    'warangal':
      'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // WEST INDIA — MAHARASHTRA
    // ==========================================================

    'mumbai':
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',

    'bombay':
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',

    'pune':
      'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80',

    'nagpur':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'nashik':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'aurangabad':
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',

    'chhatrapati sambhaji nagar':
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',

    'lonavala':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'mahabaleshwar':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // WEST INDIA — GUJARAT
    // ==========================================================

    'ahmedabad':
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',

    'surat':
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',

    'vadodara':
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',

    'rajkot':
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',

    'dwarka':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'somnath':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'kutch':
      'https://images.unsplash.com/photo-1473580044384-7ba9967f4b9c?auto=format&fit=crop&w=1200&q=80',

    'rann of kutch':
      'https://images.unsplash.com/photo-1473580044384-7ba9967f4b9c?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // GOA
    // ==========================================================

    'goa':
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',

    'panaji':
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // CENTRAL INDIA
    // ==========================================================

    'bhopal':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'indore':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'gwalior':
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',

    'khajuraho':
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',

    'jabalpur':
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',

    'raipur':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // NORTHEAST INDIA
    // ==========================================================

    'guwahati':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'shillong':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'meghalaya':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'kaziranga':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'assam':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'imphal':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'manipur':
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',

    'aizawl':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'mizoram':
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',

    'kohima':
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',

    'nagaland':
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // ISLANDS
    // ==========================================================

    'andaman':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'andaman and nicobar':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'port blair':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'lakshadweep':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    // ==========================================================
    // INTERNATIONAL
    // ==========================================================

    'maldives':
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',

    'bali':
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',

    'dubai':
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',

    'singapore':
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',

    'bangkok':
      'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',

    'london':
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',

    'paris':
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',

    'new york':
      'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1200&q=80',

    'tokyo':
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',

    'switzerland':
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',

    'nepal':
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',

    'bhutan':
      'https://images.unsplash.com/photo-1553856622-d1b352e9a211?auto=format&fit=crop&w=1200&q=80'
  };

  /*
   * ============================================================
   * KEYWORD FALLBACKS
   * ============================================================
   *
   * Used when a destination isn't explicitly listed above.
   */

  private readonly keywordImages: Array<{
    keywords: string[];
    url: string;
  }> = [

    {
      keywords: [
        'beach',
        'sea',
        'island',
        'coast',
        'ocean',
        'marine',
        'coastal'
      ],
      url:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    },

    {
      keywords: [
        'mountain',
        'mountains',
        'himalaya',
        'hill',
        'hills',
        'snow',
        'peak',
        'valley'
      ],
      url:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    },

    {
      keywords: [
        'lake',
        'river',
        'waterfall',
        'valley',
        'riverfront'
      ],
      url:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
    },

    {
      keywords: [
        'forest',
        'jungle',
        'wildlife',
        'national park',
        'sanctuary'
      ],
      url:
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
    },

    {
      keywords: [
        'desert',
        'jaisalmer',
        'rajasthan',
        'thar'
      ],
      url:
        'https://images.unsplash.com/photo-1473580044384-7ba9967f4b9c?auto=format&fit=crop&w=1200&q=80'
    },

    {
      keywords: [
        'city',
        'urban',
        'metro',
        'capital'
      ],
      url:
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80'
    },

    {
      keywords: [
        'temple',
        'pilgrimage',
        'spiritual',
        'religious'
      ],
      url:
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  /*
   * Cache prevents repeated processing for the same destination.
   *
   * Example:
   * 10 Manali posts
   * -> only resolve "manali" once.
   */
  private readonly cache = new Map<string, string>();

  getImageUrl(
    destination: string | null | undefined
  ): string {

    const normalized = this.normalize(destination);

    if (!normalized) {
      return this.fallbackImage;
    }

    const cached = this.cache.get(normalized);

    if (cached) {
      return cached;
    }

    /*
     * 1. Exact destination match
     */
    const exactImage = this.images[normalized];

    if (exactImage) {
      this.cache.set(normalized, exactImage);
      return exactImage;
    }

    /*
     * 2. Partial destination match
     *
     * Handles:
     *
     * Manali, Himachal Pradesh
     * Goa, India
     * Kolkata, West Bengal
     * Srinagar, Kashmir
     */
    const matchingKey = Object.keys(this.images).find(
      key =>
        normalized.includes(key) ||
        key.includes(normalized)
    );

    if (matchingKey) {
      const matchedImage = this.images[matchingKey];

      this.cache.set(normalized, matchedImage);

      return matchedImage;
    }

    /*
     * 3. Keyword-based matching
     */
    const keywordMatch = this.keywordImages.find(item =>
      item.keywords.some(keyword =>
        normalized.includes(keyword)
      )
    );

    if (keywordMatch) {
      this.cache.set(normalized, keywordMatch.url);

      return keywordMatch.url;
    }

    /*
     * 4. Generic TravelMatch fallback
     *
     * Never return undefined.
     * Never create a broken image.
     */
    this.cache.set(normalized, this.fallbackImage);

    return this.fallbackImage;
  }

  private normalize(
    value: string | null | undefined
  ): string {

    return (value || '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/,/g, ' ')
      .replace(/-/g, ' ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}