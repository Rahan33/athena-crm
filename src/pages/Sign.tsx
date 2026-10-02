import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { PenTool, CheckCircle, FileText, Send, Download } from 'lucide-react';

export default function Sign() {
  const sigCanvas = useRef<any>(null);
  const [signed, setSigned] = useState(false);

  const clear = () => {
    sigCanvas.current?.clear();
    setSigned(false);
  };
  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Please provide a signature first.");
    } else {
      setSigned(true);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-100 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><PenTool className="w-5 h-5 text-indigo-600"/> Digital Signatures</h1>
          <p className="text-xs text-gray-500">Document ID: #NDA-8821-X</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-700"><Download className="w-4 h-4 inline mr-2"/> Download Original</button>
           {signed && <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"><Send className="w-4 h-4 inline mr-2"/> Complete Document</button>}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl bg-white shadow-lg border border-gray-200 p-10 min-h-[800px] flex flex-col">
          <div className="flex justify-between border-b-2 border-gray-900 pb-4 mb-8">
            <h2 className="text-3xl font-black uppercase text-gray-900">Non-Disclosure Agreement</h2>
            <div className="text-right text-gray-500 font-bold">Date: {new Date().toLocaleDateString()}</div>
          </div>
          <div className="flex-1 space-y-4 text-gray-700 text-sm leading-relaxed">
             <p>This Non-Disclosure Agreement (the "Agreement") is entered into by and between Athena Inc ("Disclosing Party") and the Undersigned ("Receiving Party").</p>
             <p><strong>1. Confidential Information:</strong> The Receiving Party agrees to maintain the confidentiality of all proprietary information shared during the course of the business relationship.</p>
             <p><strong>2. Term:</strong> This Agreement shall remain in effect for a period of five (5) years from the date of execution.</p>
             <p><strong>3. Binding Effect:</strong> This Agreement is binding upon and shall inure to the benefit of the parties hereto and their respective successors and assigns.</p>
          </div>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">Please Sign Below:</h3>
             {signed ? (
               <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2"/>
                 <h4 className="font-bold text-green-800 text-lg">Signature Captured Successfully</h4>
                 <p className="text-sm text-green-600 mb-4">Secured via cryptographic hash.</p>
                 <button onClick={clear} className="text-sm font-bold text-green-700 underline">Clear & Sign Again</button>
               </div>
             ) : (
               <div className="flex flex-col items-center">
                 <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg w-full max-w-md h-40">
                   {/* @ts-ignore */}
                   <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{className: 'w-full h-full rounded-lg'}} />
                 </div>
                 <div className="flex gap-4 mt-4">
                   <button onClick={clear} className="px-4 py-2 font-bold text-gray-500">Clear</button>
                   <button onClick={save} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-sm">Save Signature</button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
