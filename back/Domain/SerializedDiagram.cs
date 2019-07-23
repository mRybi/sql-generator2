namespace Domain
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class SerializedDiagram
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("offsetX")]
        public long OffsetX { get; set; }

        [JsonProperty("offsetY")]
        public long OffsetY { get; set; }

        [JsonProperty("zoom")]
        public long Zoom { get; set; }

        [JsonProperty("gridSize")]
        public long GridSize { get; set; }

        [JsonProperty("links")]
        public Link[] Links { get; set; }

        [JsonProperty("nodes")]
        public Node[] Nodes { get; set; }
    }

    public partial class Link
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("selected")]
        public bool Selected { get; set; }

        [JsonProperty("source")]
        public Guid Source { get; set; }

        [JsonProperty("sourcePort")]
        public Guid SourcePort { get; set; }

        [JsonProperty("target")]
        public Guid Target { get; set; }

        [JsonProperty("targetPort")]
        public Guid TargetPort { get; set; }

        [JsonProperty("points")]
        public Point[] Points { get; set; }

        [JsonProperty("extras")]
        public Extras Extras { get; set; }

        [JsonProperty("labels")]
        public Label[] Labels { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }

        [JsonProperty("color")]
        public string Color { get; set; }

        [JsonProperty("curvyness")]
        public long Curvyness { get; set; }

        [JsonProperty("relationType")]
        public string RelationType { get; set; }
    }

    public partial class Extras
    {
    }

    public partial class Label
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("selected")]
        public bool Selected { get; set; }

        [JsonProperty("offsetX")]
        public long OffsetX { get; set; }

        [JsonProperty("offsetY")]
        public long OffsetY { get; set; }

        [JsonProperty("label")]
        public string LabelLabel { get; set; }
    }

    public partial class Point
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("selected")]
        public bool Selected { get; set; }

        [JsonProperty("x")]
        public double X { get; set; }

        [JsonProperty("y")]
        public double Y { get; set; }
    }

    public partial class Node
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("selected")]
        public bool Selected { get; set; }

        [JsonProperty("x")]
        public long X { get; set; }

        [JsonProperty("y")]
        public long Y { get; set; }

        [JsonProperty("extras")]
        public Extras Extras { get; set; }

        [JsonProperty("ports")]
        public Port[] Ports { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("color")]
        public string Color { get; set; }
    }

    public partial class Port
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("selected")]
        public bool Selected { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("parentNode")]
        public Guid ParentNode { get; set; }

        [JsonProperty("links")]
        public Guid[] Links { get; set; }

        [JsonProperty("in")]
        public bool In { get; set; }

        [JsonProperty("label")]
        public string Label { get; set; }

        [JsonProperty("propertyType")]
        public string PropertyType { get; set; }

        [JsonProperty("isForeignKey")]
        public bool IsForeignKey { get; set; }

        [JsonProperty("isPrimaryKey")]
        public bool IsPrimaryKey { get; set; }

        [JsonProperty("isNotNull")]
        public bool IsNotNull { get; set; }

        [JsonProperty("isAutoincremented")]
        public bool IsAutoincremented { get; set; }

        [JsonProperty("isUnique")]
        public bool IsUnique { get; set; }
    }

    public partial class SerializedDiagram
    {
        public static SerializedDiagram FromJson(string json) => JsonConvert.DeserializeObject<SerializedDiagram>(json, Domain.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this SerializedDiagram self) => JsonConvert.SerializeObject(self, Domain.Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters = {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}


// Generated by https://quicktype.io
//
// To change quicktype's target language, run command:
//
//   "Set quicktype target language"

// namespace Domain
// {
//     using System;
//     using System.Collections.Generic;

//     using System.Globalization;
//     using Newtonsoft.Json;
//     using Newtonsoft.Json.Converters;

//     public partial class SerializedDiagram
//     {
//         [JsonProperty("id")]
//         public Guid Id { get; set; }

//         [JsonProperty("offsetX")]
//         public long OffsetX { get; set; }

//         [JsonProperty("offsetY")]
//         public long OffsetY { get; set; }

//         [JsonProperty("zoom")]
//         public long Zoom { get; set; }

//         [JsonProperty("gridSize")]
//         public long GridSize { get; set; }

//         [JsonProperty("links")]
//         public Link[] Links { get; set; }

//         [JsonProperty("nodes")]
//         public Node[] Nodes { get; set; }
//     }

//     public partial class Link
//     {
//         [JsonProperty("id")]
//         public Guid Id { get; set; }

//         [JsonProperty("type")]
//         public string Type { get; set; }

//         [JsonProperty("selected")]
//         public bool Selected { get; set; }

//         [JsonProperty("source")]
//         public Guid Source { get; set; }

//         [JsonProperty("sourcePort")]
//         public Guid SourcePort { get; set; }

//         [JsonProperty("target")]
//         public Guid Target { get; set; }

//         [JsonProperty("targetPort")]
//         public Guid TargetPort { get; set; }

//         [JsonProperty("points")]
//         public Point[] Points { get; set; }

//         [JsonProperty("extras")]
//         public Extras Extras { get; set; }

//         [JsonProperty("labels")]
//         public object[] Labels { get; set; }

//         [JsonProperty("width")]
//         public long Width { get; set; }

//         [JsonProperty("color")]
//         public string Color { get; set; }

//         [JsonProperty("curvyness")]
//         public long Curvyness { get; set; }
//     }

//     public partial class Extras
//     {
//     }

//     public partial class Point
//     {
//         [JsonProperty("id")]
//         public Guid Id { get; set; }

//         [JsonProperty("selected")]
//         public bool Selected { get; set; }

//         [JsonProperty("x")]
//         public long X { get; set; }

//         [JsonProperty("y")]
//         public long Y { get; set; }
//     }

//     public partial class Node
//     {
//         [JsonProperty("id")]
//         public Guid Id { get; set; }

//         [JsonProperty("type")]
//         public string Type { get; set; }

//         [JsonProperty("selected")]
//         public bool Selected { get; set; }

//         [JsonProperty("x")]
//         public long X { get; set; }

//         [JsonProperty("y")]
//         public long Y { get; set; }

//         [JsonProperty("extras")]
//         public Extras Extras { get; set; }

//         [JsonProperty("ports")]
//         public Port[] Ports { get; set; }

//         [JsonProperty("name")]
//         public string Name { get; set; }

//         [JsonProperty("color")]
//         public string Color { get; set; }
//     }

//     public partial class Port
//     {
//         [JsonProperty("id")]
//         public Guid Id { get; set; }

//         [JsonProperty("type")]
//         public string Type { get; set; }

//         [JsonProperty("selected")]
//         public bool Selected { get; set; }

//         [JsonProperty("name")]
//         public string Name { get; set; }

//         [JsonProperty("parentNode")]
//         public Guid ParentNode { get; set; }

//         [JsonProperty("links")]
//         public Guid[] Links { get; set; }

//         [JsonProperty("in")]
//         public bool In { get; set; }

//         [JsonProperty("label")]
//         public string Label { get; set; }

//         [JsonProperty("isPrimaryKey")]
//         public bool IsPrimaryKey { get; set; }

//         [JsonProperty("isForeignKey")]
//         public bool IsForeignKey { get; set; }

//         [JsonProperty("isNotNull")]
//         public bool IsNotNull { get; set; }

//         [JsonProperty("isUnique")]
//         public bool IsUnique { get; set; }

//         [JsonProperty("isAutoincremented")]
//         public bool IsAutoincremented { get; set; }

//         [JsonProperty("propertyType")]
//         public string PropertyType { get; set; }
//     }

//     public partial class SerializedDiagram
//     {
//         public static SerializedDiagram FromJson(string json) => JsonConvert.DeserializeObject<SerializedDiagram>(json, Domain.Converter.Settings);
//     }

//     public static class Serialize
//     {
//         public static string ToJson(this SerializedDiagram self) => JsonConvert.SerializeObject(self, Domain.Converter.Settings);
//     }

//     internal static class Converter
//     {
//         public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
//         {
//             MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
//             DateParseHandling = DateParseHandling.None,
//             Converters = {
//                 new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
//             },
//         };
//     }
// }
