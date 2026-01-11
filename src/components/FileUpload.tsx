import { useCallback } from "react";
import { Upload, FileJson } from "lucide-react";
import { FleetData } from "@/types/fleet";

interface FileUploadProps {
  onDataLoaded: (data: FleetData[]) => void;
}

export function FileUpload({ onDataLoaded }: FileUploadProps) {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (Array.isArray(json)) {
            onDataLoaded(json);
          } else {
            alert("O arquivo deve conter um array de dados.");
          }
        } catch {
          alert("Erro ao ler o arquivo JSON. Verifique o formato.");
        }
      };
      reader.readAsText(file);
    },
    [onDataLoaded]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (!file) return;

      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        alert("Por favor, envie um arquivo JSON.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (Array.isArray(json)) {
            onDataLoaded(json);
          } else {
            alert("O arquivo deve conter um array de dados.");
          }
        } catch {
          alert("Erro ao ler o arquivo JSON. Verifique o formato.");
        }
      };
      reader.readAsText(file);
    },
    [onDataLoaded]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div
        className="glass-card rounded-2xl p-12 max-w-xl w-full text-center animate-scale-in cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-primary/30"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileJson className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3">Painel de Frota</h1>
        <p className="text-muted-foreground mb-8">
          Carregue seu arquivo JSON com os dados da frota para visualizar o painel de desempenho
        </p>

        <label className="block">
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold cursor-pointer transition-all duration-200 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25">
            <Upload className="w-5 h-5" />
            Selecionar Arquivo JSON
          </div>
        </label>

        <p className="text-sm text-muted-foreground mt-6">
          ou arraste e solte o arquivo aqui
        </p>
      </div>
    </div>
  );
}
