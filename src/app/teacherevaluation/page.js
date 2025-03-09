"use client"
import React, { useEffect, useState } from 'react';
import { Pencil, Save, X, MessageCircle, Check } from 'lucide-react';
import { useSearchParams } from "next/navigation";
const TeacherEvaluationPage = () => {
  // Sample student data - would come from props or API in real implementation
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const roll = searchParams.get("roll");

  const studentData = {
    name: "Alex Johnson",
    rollNumber: "CS2023054",
    questionPaperCode: "CS301-MIDTERM-2025"
  };

  const [showSummary, setShowSummary] = useState(false);

  useEffect(()=>{
    const fetchdetails=async()=>{
      const res=await fetch(`/api/get-ans?name=${name}&?roll=${roll}`)
    }
  })
  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      questionText: "Explain the concept of polymorphism in object-oriented programming.",
      studentResponse: "Polymorphism is the ability of an object to take on many forms. The most common use of polymorphism in OOP occurs when a parent class reference is used to refer to a child class object. It allows methods to be written that can operate on a variety of data types and objects. There are two types of polymorphism: compile-time polymorphism (method overloading) and runtime polymorphism (method overriding).",
      mark: 8.5,
      aiCorrections: "Good explanation of the concept with mention of different types of polymorphism. Could have included more concrete examples to demonstrate the concept in practice.",
      teacherRemark: "",
      isEditingMark: false,
      isAddingRemark: false
    },
    {
      id: 2,
      questionText: "Describe the principles of RESTful API design.",
      studentResponse: "REST stands for Representational State Transfer. RESTful APIs use HTTP requests to perform CRUD operations. The main principles include: client-server architecture, statelessness, cacheability, uniform interface, and layered system. RESTful APIs typically use JSON for data transfer and standard HTTP methods like GET, POST, PUT, DELETE.",
      mark: 7.0,
      aiCorrections: "Covers basic principles but lacks depth on implementation details. Should have elaborated on how these principles translate to actual API endpoints and HTTP status codes. Examples of good RESTful endpoint design would strengthen the answer.",
      teacherRemark: "",
      isEditingMark: false,
      isAddingRemark: false
    },
    {
      id: 3,
      questionText: "Compare and contrast microservices architecture with monolithic architecture.",
      studentResponse: "Monolithic architecture is a traditional model where all components of an application are interconnected and operate as a single unit. Microservices architecture breaks down an application into smaller, independent services that communicate through APIs. Microservices offer benefits like scalability, easier maintenance, and technology flexibility, but introduce complexity in deployment, monitoring, and data consistency. Monolithic architectures are simpler to develop initially but become challenging to maintain as they grow.",
      mark: 9.0,
      aiCorrections: "Excellent comparison covering key differences. The answer effectively highlights advantages and disadvantages of both approaches. Could have briefly mentioned containerization and orchestration tools that are commonly used with microservices.",
      teacherRemark: "Very comprehensive answer. Shows clear understanding of architectural patterns.",
      isEditingMark: false,
      isAddingRemark: false
    }
  ]);

  // Toggle editing states
  const toggleEditMark = (id) => {
    setEvaluations(evaluations.map(item => 
      item.id === id ? { ...item, isEditingMark: !item.isEditingMark } : item
    ));
  };

  const toggleAddRemark = (id) => {
    setEvaluations(evaluations.map(item => 
      item.id === id ? { ...item, isAddingRemark: !item.isAddingRemark } : item
    ));
  };

  // Update mark
  const updateMark = (id, mark) => {
    setEvaluations(evaluations.map(item => 
      item.id === id ? { 
        ...item, 
        mark: mark,
        isEditingMark: false 
      } : item
    ));
  };

  // Update teacher remark
  const updateRemark = (id, remark) => {
    setEvaluations(evaluations.map(item => 
      item.id === id ? { 
        ...item, 
        teacherRemark: remark,
        isAddingRemark: false 
      } : item
    ));
  };

  // Calculate total mark
  const calculateTotalMark = () => {
    return evaluations.reduce((total, item) => total + item.mark, 0);
  };

  // Handle finalize button click
  const handleFinalize = () => {
    setShowSummary(true);
  };

  // Close summary modal
  const closeSummary = () => {
    setShowSummary(false);
  };

  // Render each evaluation card
  const renderEvaluationCard = (evaluation) => {
    const [tempMark, setTempMark] = useState(evaluation.mark);
    const [tempRemark, setTempRemark] = useState(evaluation.teacherRemark);

    const handleSaveMark = () => {
      updateMark(evaluation.id, tempMark);
    };

    const handleCancelMark = () => {
      setTempMark(evaluation.mark);
      toggleEditMark(evaluation.id);
    };

    const handleSaveRemark = () => {
      updateRemark(evaluation.id, tempRemark);
    };

    const handleCancelRemark = () => {
      setTempRemark(evaluation.teacherRemark);
      toggleAddRemark(evaluation.id);
    };

    return (
      <div key={evaluation.id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {/* Question */}
        <div className="bg-emerald-600 p-4">
          <h3 className="text-lg font-semibold text-white">Question {evaluation.id}</h3>
        </div>
        
        <div className="p-4">
          <p className="font-medium text-gray-800 mb-4">{evaluation.questionText}</p>
          
          {/* Student Response */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Student Response:</h4>
            <p className="text-gray-800">{evaluation.studentResponse}</p>
          </div>
          
          {/* AI Remark */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Remark:</h4>
            <p className="text-gray-800">{evaluation.aiCorrections}</p>
          </div>
          
          {/* Evaluation */}
          <div className="flex flex-wrap items-start justify-between">
            {/* Mark section */}
            <div className="mb-4 mr-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                Mark:
                {!evaluation.isEditingMark && (
                  <button 
                    onClick={() => toggleEditMark(evaluation.id)}
                    className="ml-2 text-emerald-600 hover:text-emerald-800"
                    aria-label="Edit mark"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </h4>
              
              {evaluation.isEditingMark ? (
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={tempMark}
                    onChange={(e) => setTempMark(parseFloat(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <div className="flex ml-2">
                    <button
                      onClick={handleSaveMark}
                      className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 mr-1"
                      aria-label="Save mark"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={handleCancelMark}
                      className="p-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      aria-label="Cancel edit"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <span className="font-medium text-emerald-600 text-lg">{evaluation.mark} / 10</span>
              )}
            </div>
            
            {/* Teacher Remark section */}
            <div className="mb-4 flex-grow">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                Teacher Remark:
                <button 
                  onClick={() => toggleAddRemark(evaluation.id)}
                  className="ml-2 text-emerald-600 hover:text-emerald-800"
                  aria-label={evaluation.teacherRemark ? "Edit remark" : "Add remark"}
                >
                  {evaluation.teacherRemark ? <Pencil size={16} /> : <MessageCircle size={16} />}
                </button>
              </h4>
              
              {evaluation.isAddingRemark ? (
                <div>
                  <textarea
                    value={tempRemark}
                    onChange={(e) => setTempRemark(e.target.value)}
                    placeholder="Add your remark here (optional)"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-2"
                  ></textarea>
                  <div className="flex">
                    <button
                      onClick={handleSaveRemark}
                      className="flex items-center px-2 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 mr-2"
                    >
                      <Save size={16} className="mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelRemark}
                      className="flex items-center px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      <X size={16} className="mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800">
                  {evaluation.teacherRemark || 
                   <span className="text-gray-400 italic">No additional remarks</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal for evaluation summary
  const renderSummary = () => {
    if (!showSummary) return null;
    
    const totalMark = calculateTotalMark();
    const maxPossibleMark = evaluations.length * 10;
    const percentage = ((totalMark / maxPossibleMark) * 100).toFixed(1);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-800">Evaluation Summary</h2>
              <button 
                onClick={closeSummary}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Close summary"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Student Information</h3>
              <p className="text-gray-700">Name: <span className="font-medium">{studentData.name}</span></p>
              <p className="text-gray-700">Roll Number: <span className="font-medium">{studentData.rollNumber}</span></p>
              <p className="text-gray-700">Question Paper: <span className="font-medium">{studentData.questionPaperCode}</span></p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Question-wise Marks</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question No.</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mark</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {evaluations.map(evaluation => (
                      <tr key={evaluation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Question {evaluation.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {evaluation.questionText}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                          {evaluation.mark} / 10
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-emerald-800 mb-2">Final Score</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-700">Total Mark: <span className="font-bold">{totalMark.toFixed(1)}</span> / {maxPossibleMark}</p>
                  <p className="text-emerald-700">Percentage: <span className="font-bold">{percentage}%</span></p>
                </div>
                <div className="bg-emerald-600 text-white text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center">
                  {totalMark.toFixed(1)}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={closeSummary}
                className="flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <Check size={20} className="mr-2" />
                Confirm and Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">
            {studentData.name} <span className="text-emerald-600">({studentData.rollNumber})</span>
          </h1>
          <p className="text-lg text-emerald-600">
            Question Paper: <span className="font-medium">{studentData.questionPaperCode}</span>
          </p>
        </header>
        
        {/* Evaluations List */}
        <div className="space-y-6">
          {evaluations.map(evaluation => renderEvaluationCard(evaluation))}
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleFinalize}
            className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Finalize Evaluation
          </button>
        </div>
        
        {/* Summary Modal */}
        {renderSummary()}
      </div>
    </div>
  );
};

export default TeacherEvaluationPage;