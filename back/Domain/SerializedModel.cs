using System.Globalization;
using System;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json;

namespace Domain {

    public partial class SerializedModel {
        [JsonProperty ("id")]
        public Guid Id { get; set; }

        [JsonProperty ("links")]
        public Link[] Links { get; set; }

        [JsonProperty ("nodes")]
        public Node[] Nodes { get; set; }
    }

    public partial class Link {
        [JsonProperty ("id")]
        public Guid Id { get; set; }

        [JsonProperty ("source")]
        public Guid Source { get; set; }

        [JsonProperty ("sourcePort")]
        public Guid SourcePort { get; set; }

        [JsonProperty ("target")]
        public Guid Target { get; set; }

        [JsonProperty ("targetPort")]
        public Guid TargetPort { get; set; }

        [JsonProperty ("labels")]
        public Label[] Labels { get; set; }

        public Link (Guid source, Guid sourcePort, Guid target, Guid targetPort) {
            this.Id = new Guid ();
            this.Source = source;
            this.SourcePort = sourcePort;
            this.Target = target;
            this.TargetPort = targetPort;
        }
    }

    public partial class Label {
        [JsonProperty ("id")]
        public Guid Id { get; set; }

        [JsonProperty ("label")]
        public string LabelLabel { get; set; }
    }

    public partial class Node {
        [JsonProperty ("id")]
        public Guid Id { get; set; }

        [JsonProperty ("ports")]
        public Port[] Ports { get; set; }

        [JsonProperty ("name")]
        public string Name { get; set; }

        public Node (string name) {
            this.Id = new Guid ();
            this.Name = name;
        }
    }

    public partial class Port {
        [JsonProperty ("id")]
        public Guid Id { get; set; }

        [JsonProperty ("name")]
        public string Name { get; set; }

        [JsonProperty ("parentNode")]
        public Guid ParentNode { get; set; }

        [JsonProperty ("links")]
        public Guid[] Links { get; set; }

        [JsonProperty ("label")]
        public string Label { get; set; }

        [JsonProperty ("isPrimaryKey")]
        public bool IsPrimaryKey { get; set; }

        [JsonProperty ("isForeignKey")]
        public bool IsForeignKey { get; set; }

        [JsonProperty ("isNotNull")]
        public bool IsNotNull { get; set; }

        [JsonProperty ("isUnique")]
        public bool IsUnique { get; set; }

        [JsonProperty ("isAutoincremented")]
        public bool IsAutoincremented { get; set; }

        [JsonProperty ("propertyType")]
        public string PropertyType { get; set; }

        public Port (string name, string propertyType, Guid parentNode, Boolean isPrimaryKey, Boolean isForeignKey, Boolean isAutoincremented, Boolean isNotNull, Boolean isUnique = false, Guid[] links = null) {
            this.Name = name;
            this.Label = name;
            this.PropertyType = propertyType;
            this.ParentNode = parentNode;
            this.IsAutoincremented = isAutoincremented;
            this.IsPrimaryKey = isPrimaryKey;
            this.IsNotNull = isNotNull;
            this.IsForeignKey = isForeignKey;
            this.IsUnique = isUnique;
            this.Links = links;
        }
    }

    public partial class SerializedModel {
        public static SerializedModel FromJson (string json) => JsonConvert.DeserializeObject<SerializedModel> (json, Domain.Converter.Settings);
    }

    public static class Serialize {
        public static string ToJson (this SerializedModel self) => JsonConvert.SerializeObject (self, Domain.Converter.Settings);
    }

    internal static class Converter {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters = {
            new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}