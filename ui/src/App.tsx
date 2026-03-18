import React, { useState } from 'react';
import { 
  Folder, FileCode, Trash2, FolderPlus, FilePlus, 
  ChevronRight, ChevronDown, Terminal, Save, Layout, Sparkles 
} from 'lucide-react';

// --- Types ---
interface ArchNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: ArchNode[];
  content?: string;
  template?: string;
}

// --- Next.js Templates ---
const NEXT_TEMPLATES: Record<string, string> = {
  'page.tsx': `export default function Page() {\n  return (\n    <main className="p-8">\n      <h1 className="text-2xl font-bold">New Page</h1>\n    </main>\n  );\n}`,
  'layout.tsx': `export default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <div className="flex min-h-screen">\n      <aside className="w-64 border-r">Sidebar</aside>\n      <section className="flex-1">{children}</section>\n    </div>\n  );\n}`,
  'globals.css': `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  --foreground-rgb: 0, 0, 0;\n  --background-start-rgb: 214, 219, 220;\n  --background-end-rgb: 255, 255, 255;\n}`,
};

const getDefaultContent = (filename: string) => {
  if (NEXT_TEMPLATES[filename]) return NEXT_TEMPLATES[filename];
  const ext = filename.split('.').pop();
  return `// Content for ${filename} (${ext})`;
};

export default function App() {
  const [projectName, setProjectName] = useState('asurada-web-app');
  const [customPath, setCustomPath] = useState(''); // 로컬 경로 지정
  const [nodes, setNodes] = useState<ArchNode[]>([
    { id: 'root', name: 'apps/web', type: 'folder', children: [] }
  ]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'root': true });

  // --- Presets ---
  const loadNextJsPreset = () => {
    const preset: ArchNode[] = [{
      id: 'root', name: 'apps/web', type: 'folder', children: [
        { id: 'app', name: 'app', type: 'folder', children: [
          { id: 'dash-grp', name: '(dashboard)', type: 'folder', children: [
            { id: 'dash-pg', name: 'dashboard', type: 'folder', children: [
              { id: 'p1', name: 'page.tsx', type: 'file', content: NEXT_TEMPLATES['page.tsx'] }
            ]},
            { id: 'l1', name: 'layout.tsx', type: 'file', content: NEXT_TEMPLATES['layout.tsx'] }
          ]},
          { id: 'css', name: 'globals.css', type: 'file', content: NEXT_TEMPLATES['globals.css'] }
        ]},
        { id: 'comp', name: 'components', type: 'folder', children: [] },
        { id: 'pkg', name: 'package.json', type: 'file', template: 'package-json' }
      ]
    }];
    setNodes(preset);
  };

  const runBuild = async () => {
    const structure: any[] = [];
    const flatten = (list: ArchNode[], currentPath: string = '') => {
      list.forEach(node => {
        const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;
        structure.push({
          path: fullPath,
          type: node.type === 'folder' ? 'directory' : 'file',
          content: node.content || '',
          template: node.template
        });
        if (node.children) flatten(node.children, fullPath);
      });
    };
    flatten(nodes);

    try {
      const res = await fetch('http://localhost:9012/api/scaffold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ structure, projectName, customPath })
      });
      const result = await res.json();
      if (res.ok) {
        if (window.confirm(`🚀 BUILD SUCCESS!\nLocation: ${result.targetPath}\n\nOpen in VS Code?`)) {
          await fetch('http://localhost:9012/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: 'code .', projectName, customPath })
          });
        }
      }
    } catch (err) {
      alert('Bridge Server Offline');
    }
  };

  // --- Recursive Render Component ---
  const renderTree = (list: ArchNode[], depth: number = 0) => {
    return list.map(node => (
      <div key={node.id} className="select-none">
        <div 
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          className="group flex items-center gap-2 py-2 hover:bg-white/5 rounded-lg transition-all cursor-pointer border border-transparent hover:border-gray-800"
        >
          {node.type === 'folder' && (
            <div onClick={() => toggleExpand(node.id)}>
              {expanded[node.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          )}
          {node.type === 'folder' ? <Folder size={16} className="text-cyan-400" /> : <FileCode size={16} className="text-purple-400" />}
          
          <span className="flex-1 text-sm font-mono text-gray-300">{node.name}</span>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 pr-2">
            {node.type === 'folder' && (
              <>
                <button onClick={() => addNode(node.id, 'folder')} className="p-1 hover:bg-cyan-500/20 rounded text-cyan-500" title="Add Folder">
                  <FolderPlus size={14} />
                </button>
                <button onClick={() => addNode(node.id, 'file')} className="p-1 hover:bg-purple-500/20 rounded text-purple-500" title="Add File">
                  <FilePlus size={14} />
                </button>
              </>
            )}
            <button onClick={() => deleteNode(node.id)} className="p-1 hover:bg-red-500/20 rounded text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {node.type === 'folder' && expanded[node.id] && node.children && (
          <div>{renderTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex h-screen bg-[#050505] text-gray-200 font-sans overflow-hidden">
      {/* Sidebar: Blueprint Guide */}
      <div className="w-80 border-r border-gray-900 bg-[#0a0a0a] p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3 text-cyan-400 mb-4">
          <Terminal size={24} />
          <h1 className="font-bold text-lg tracking-tight">ARCH BUILDER v3</h1>
        </div>

        <div className="bg-cyan-900/10 border border-cyan-500/20 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles size={12} />
            AI Architect Guide
          </div>
          <div className="text-[11px] font-mono leading-relaxed text-gray-400 space-y-1">
            <p className="text-white">apps/web/</p>
            <p>├── app/</p>
            <p>│   ├── (dashboard)/</p>
            <p>│   │   ├── dashboard/page.tsx</p>
            <p>│   │   └── layout.tsx</p>
            <p>│   └── globals.css</p>
            <p>└── components/</p>
          </div>
          <button className="w-full mt-4 py-2 border border-cyan-500/30 rounded-xl text-[10px] font-bold hover:bg-cyan-500/10 transition-all">
            LOAD GUIDE
          </button>
        </div>

        <div className="mt-auto space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-bold uppercase ml-1">Project Root</p>
            <input 
              value={projectName} 
              onChange={e => setProjectName(e.target.value)}
              className="w-full bg-[#111] border border-gray-800 p-3 rounded-xl text-sm font-mono text-cyan-400 focus:border-cyan-500 outline-none"
            />
          </div>
          <button onClick={runBuild} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-cyan-900/20 transition-all active:scale-95">
            BUILD ON DISK
          </button>
        </div>
      </div>

      {/* Main Canvas: Tree Builder */}
      <div className="flex-1 bg-[#050505] p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-cyan-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Structure Design</h2>
              <p className="text-3xl font-black text-white">Project Hierarchy</p>
            </div>
            <p className="text-gray-500 font-mono text-xs italic">Build manually following the guide.</p>
          </header>

          <div className="bg-[#0a0a0a] border border-gray-900 rounded-[2rem] p-8 min-h-[600px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            
            <div className="space-y-1">
              {renderTree(nodes)}
            </div>

            {nodes[0].children?.length === 0 && (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-900 rounded-3xl opacity-30">
                <Layout size={40} className="mb-4 text-gray-600" />
                <p className="text-xs font-mono uppercase tracking-widest text-gray-500">Design Canvas Empty</p>
                <p className="text-[10px] text-gray-700 mt-2">Click icons inside "apps/web" to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
