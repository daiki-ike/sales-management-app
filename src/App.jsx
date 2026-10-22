import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Award, Upload, Download, Save } from 'lucide-react';
import Papa from 'papaparse';

export default function DepartmentSalesTracker() {
  // 初期サンプルデータ
  const initialDepartmentData = [
    { date: '2025-01', sales: 5000000, profit: 1500000 },
    { date: '2025-02', sales: 5500000, profit: 1650000 },
    { date: '2025-03', sales: 6200000, profit: 1860000 },
    { date: '2025-04', sales: 5800000, profit: 1740000 },
  ];

  const initialMembersData = [
    {
      id: 1,
      name: '田中太郎',
      data: [
        { date: '2025-01', sales: 800000, profit: 240000 },
        { date: '2025-02', sales: 850000, profit: 255000 },
        { date: '2025-03', sales: 920000, profit: 276000 },
        { date: '2025-04', sales: 880000, profit: 264000 },
      ]
    },
    {
      id: 2,
      name: '佐藤花子',
      data: [
        { date: '2025-01', sales: 650000, profit: 195000 },
        { date: '2025-02', sales: 720000, profit: 216000 },
        { date: '2025-03', sales: 780000, profit: 234000 },
        { date: '2025-04', sales: 750000, profit: 225000 },
      ]
    },
    {
      id: 3,
      name: '鈴木一郎',
      data: [
        { date: '2025-01', sales: 550000, profit: 165000 },
        { date: '2025-02', sales: 580000, profit: 174000 },
        { date: '2025-03', sales: 620000, profit: 186000 },
        { date: '2025-04', sales: 600000, profit: 180000 },
      ]
    },
  ];

  const [departmentData, setDepartmentData] = useState(initialDepartmentData);
  const [membersData, setMembersData] = useState(initialMembersData);
  const [selectedMember, setSelectedMember] = useState(null);
  const [rankingBy, setRankingBy] = useState('sales');
  const [saveMessage, setSaveMessage] = useState('');

  // データをメモリに保存（ページを閉じると消える）
  const saveData = () => {
    const data = {
      departmentData,
      membersData
    };
    // 注：ブラウザのlocalStorageは使えないので、ダウンロード機能を使ってください
    setSaveMessage('データをCSVでダウンロードして保存してください！');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // CSV読み込み（部門データ）
  const handleDepartmentCSV = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.map(row => ({
            date: row.date || row['日付'] || row['年月'],
            sales: Number(row.sales || row['売上']),
            profit: Number(row.profit || row['粗利'] || row['利益'])
          }));
          setDepartmentData(data);
          alert('部門データを読み込みました！');
        }
      });
    }
  };

  // CSV読み込み（個人データ）
  const handleMembersCSV = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // データを部員ごとにグループ化
          const memberMap = {};
          results.data.forEach(row => {
            const name = row.name || row['氏名'] || row['名前'];
            const date = row.date || row['日付'] || row['年月'];
            const sales = Number(row.sales || row['売上']);
            const profit = Number(row.profit || row['粗利'] || row['利益']);
            
            if (!memberMap[name]) {
              memberMap[name] = {
                id: Object.keys(memberMap).length + 1,
                name: name,
                data: []
              };
            }
            memberMap[name].data.push({ date, sales, profit });
          });
          
          setMembersData(Object.values(memberMap));
          alert('個人データを読み込みました！');
        }
      });
    }
  };

  // CSV出力（部門データ）
  const downloadDepartmentCSV = () => {
    const csv = Papa.unparse(departmentData, {
      columns: ['date', 'sales', 'profit'],
      header: true
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '部門データ.csv';
    link.click();
  };

  // CSV出力（個人データ）
  const downloadMembersCSV = () => {
    const flatData = [];
    membersData.forEach(member => {
      member.data.forEach(d => {
        flatData.push({
          name: member.name,
          date: d.date,
          sales: d.sales,
          profit: d.profit
        });
      });
    });
    
    const csv = Papa.unparse(flatData, {
      columns: ['name', 'date', 'sales', 'profit'],
      header: true
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '個人データ.csv';
    link.click();
  };

  // ランキング作成
  const getRanking = () => {
    return membersData.map(member => {
      const totalSales = member.data.reduce((sum, d) => sum + d.sales, 0);
      const totalProfit = member.data.reduce((sum, d) => sum + d.profit, 0);
      return {
        ...member,
        totalSales,
        totalProfit
      };
    }).sort((a, b) => rankingBy === 'sales' ? b.totalSales - a.totalSales : b.totalProfit - a.totalProfit);
  };

  const ranking = getRanking();
  const deptTotalSales = departmentData.reduce((sum, d) => sum + d.sales, 0);
  const deptTotalProfit = departmentData.reduce((sum, d) => sum + d.profit, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          📊 部門別・個人別売上管理
        </h1>

        {/* CSV入出力ボタン */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">データ管理</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📥 CSV読み込み</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                  <Upload size={20} />
                  部門データを読み込む
                  <input type="file" accept=".csv" onChange={handleDepartmentCSV} className="hidden" />
                </label>
                <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700">
                  <Upload size={20} />
                  個人データを読み込む
                  <input type="file" accept=".csv" onChange={handleMembersCSV} className="hidden" />
                </label>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-green-300 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📤 CSVダウンロード</h3>
              <div className="space-y-2">
                <button
                  onClick={downloadDepartmentCSV}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  <Download size={20} />
                  部門データをダウンロード
                </button>
                <button
                  onClick={downloadMembersCSV}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                  <Download size={20} />
                  個人データをダウンロード
                </button>
              </div>
            </div>
          </div>
          
          {saveMessage && (
            <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              {saveMessage}
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 CSVフォーマット例：</p>
            <p><strong>部門データ:</strong> date, sales, profit</p>
            <p><strong>個人データ:</strong> name, date, sales, profit</p>
          </div>
        </div>

        {/* 部門全体セクション */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">部門全体の推移</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">売上合計</p>
              <p className="text-3xl font-bold text-blue-600">¥{deptTotalSales.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">粗利合計</p>
              <p className="text-3xl font-bold text-green-600">¥{deptTotalProfit.toLocaleString()}</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="売上" strokeWidth={3} />
              <Line type="monotone" dataKey="profit" stroke="#10b981" name="粗利" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 部員ランキングセクション */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="text-yellow-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">部員ランキング</h2>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setRankingBy('sales')}
                className={`px-4 py-2 rounded ${rankingBy === 'sales' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                売上順
              </button>
              <button
                onClick={() => setRankingBy('profit')}
                className={`px-4 py-2 rounded ${rankingBy === 'profit' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              >
                粗利順
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-center py-3 px-4">順位</th>
                  <th className="text-left py-3 px-4">氏名</th>
                  <th className="text-right py-3 px-4">売上合計</th>
                  <th className="text-right py-3 px-4">粗利合計</th>
                  <th className="text-center py-3 px-4">詳細</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((member, index) => (
                  <tr 
                    key={member.id} 
                    className={`border-b hover:bg-gray-50 ${selectedMember?.id === member.id ? 'bg-blue-50' : ''}`}
                  >
                    <td className="text-center py-3 px-4">
                      <span className={`font-bold text-lg ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-400' : 
                        index === 2 ? 'text-orange-600' : 
                        'text-gray-600'
                      }`}>
                        {index + 1}位
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{member.name}</td>
                    <td className="text-right py-3 px-4">¥{member.totalSales.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">¥{member.totalProfit.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                      >
                        グラフ表示
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 個人詳細セクション */}
        {selectedMember && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="text-purple-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">{selectedMember.name} の詳細</h2>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕ 閉じる
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">売上合計</p>
                <p className="text-2xl font-bold text-blue-600">¥{selectedMember.totalSales.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">粗利合計</p>
                <p className="text-2xl font-bold text-green-600">¥{selectedMember.totalProfit.toLocaleString()}</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={selectedMember.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="売上" />
                <Bar dataKey="profit" fill="#10b981" name="粗利" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}